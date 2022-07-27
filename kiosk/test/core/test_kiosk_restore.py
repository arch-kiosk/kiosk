import pytest
from kioskconfig import KioskConfig
from kioskrestore import KioskRestore
import psycopg2
import os

from test.testhelpers import KioskPyTestHelper

init_done = False

test_path = os.path.dirname(os.path.abspath(__file__))

config_file = os.path.join(test_path, r"config", "test_kiosk_config.yml")

log_file = os.path.join(test_path, r"log", "test_log.log")


# @pytest.mark.skip
class TestKioskRestore(KioskPyTestHelper):

    @pytest.fixture()
    def config(self):
        return self.get_config(config_file,log_file=log_file)

    @pytest.fixture(autouse=True)  # scope session gives this fixture priority over module scope
    def init_test(self, config):
        global init_done

        try:
            source_con = psycopg2.connect(
                f"dbname=urap_test user={config.database_usr_name} password={config.database_usr_pwd}")
            target_con = psycopg2.connect(
                f"dbname=urap_test user={config.database_usr_name} password={config.database_usr_pwd}")

            target_cur = target_con.cursor(cursor_factory=psycopg2.extras.DictCursor)
            target_cur.execute(f"drop table if exists test_kiosk_restore_dest")

            sql = """
                    create table test_kiosk_restore_dest
                    (
                        uid          uuid default gen_random_uuid() not null
                            constraint test_kiosk_restore_dest_pkey
                                primary key,
                        user_id      varchar(20)                    not null,
                        user_name    varchar                        not null,
                        pwd_hash     varchar                        not null,
                        repl_user_id varchar(20),
                        groups       varchar
                    );
                """
            target_cur.execute(sql)
            target_con.commit()

            source_cur = source_con.cursor(cursor_factory=psycopg2.extras.DictCursor)
            source_cur.execute(f"drop table if exists test_kiosk_restore_src")

            sql = """
                    create table test_kiosk_restore_src
                    (
                        uid          uuid default gen_random_uuid() not null
                            constraint test_kiosk_restore_src_pkey
                                primary key,
                        user_id      varchar(20)                    not null,
                        user_name    varchar                        not null,
                        pwd_hash     varchar                        not null,
                        repl_user_id varchar(20),
                        groups       varchar
                    );
                    
                    INSERT INTO test_kiosk_restore_src (uid, user_id, user_name, pwd_hash, repl_user_id, groups) 
                        VALUES ('8fa2cd40-4eb0-47f4-b3f7-9baaabfcbeee', 'u1', 'Somebody', '', 'u1', 'admin');
                    INSERT INTO test_kiosk_restore_src (uid, user_id, user_name, pwd_hash, repl_user_id) 
                        VALUES ('6418a2b7-c0ca-4ade-9db1-d173e369a2c5', 'u2', 'Somebody 2', '', 'u2');
                    INSERT INTO test_kiosk_restore_src (uid, user_id, user_name, pwd_hash, repl_user_id) 
                        VALUES ('02e15385-0c72-4cf7-8fb3-d82b46089c81', 'u3', 'Somebody else', '', 'u3');                
            """
            source_cur.execute(sql)
            source_con.commit()
        finally:
            source_con.close()
            target_con.close()

        init_done = True

    def test_transfer_record_by_record(self, config):
        assert init_done
        source_con = psycopg2.connect(
            f"dbname=urap_test user={config.database_usr_name} password={config.database_usr_pwd}")
        source_cur = source_con.cursor(cursor_factory=psycopg2.extras.DictCursor)
        source_cur.execute("select count(*) c from test_kiosk_restore_src")
        r = source_cur.fetchone()
        assert r
        assert r["c"] == 3

        target_con = psycopg2.connect(
            f"dbname=urap_test user={config.database_usr_name} password={config.database_usr_pwd}")
        target_cur = target_con.cursor(cursor_factory=psycopg2.extras.DictCursor)
        target_cur.execute("select count(*) c from test_kiosk_restore_dest")
        r = target_cur.fetchone()
        assert r
        assert r["c"] == 0

        rc = KioskRestore._transfer_record_by_record(source_con, "test_kiosk_restore_src",
                                                     target_con, "test_kiosk_restore_dest")
        assert rc == 3

        target_cur.execute("select count(*) c from test_kiosk_restore_dest")
        r = target_cur.fetchone()
        assert r
        assert r["c"] == 3

        target_con.commit()
        target_con.close()
        source_con.close()
