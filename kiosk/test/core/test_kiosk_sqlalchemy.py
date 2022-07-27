import pytest
import os
from kioskconfig import KioskConfig
from config import Config

from test.testhelpers import KioskPyTestHelper
from kioskappfactory import KioskAppFactory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import close_all_sessions

import kiosksqlalchemy
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))

config_file = os.path.join(test_path, r"config", "test_kiosk_config.yml")
base_config_file = os.path.join(test_path, r"config", "test_base_config.yml")
project_config_file = os.path.join(test_path, r"config", "test_project_config.yml")

log_file = os.path.join(test_path, r"log", "test_log.log")


# @pytest.mark.skip
class TestKioskSQLAlchemy(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    def test_sql_alchemy(self, config):
        cur = self.get_urapdb(config)
        cur.close()
        KioskSQLDb.close_connection()
        kiosksqlalchemy.instantiate_sqlalchemy_db()
        kiosk_app = self.get_kiosk_testing_app(config_file, test_path)

        assert kiosk_app
        assert "TESTING" in kiosk_app.config
        kiosksqlalchemy.set_sqlalchemy_uri(config)
        kiosk_app.config.from_object(KioskAppFactory.FlaskConfigObject(config["Flask"]))
        kiosksqlalchemy.init_sql_alchemy(kiosk_app, config)
        sql_alchemy = kiosksqlalchemy.sqlalchemy_db

        # we just check if sql alchemy can query a table.
        assert sql_alchemy
        from sqlalchemy_models.adminmodel import KioskUser
        with kiosk_app.app_context():
            user = KioskUser.query.all()
            kiosksqlalchemy.sqlalchemy_db.session.rollback()
            kiosksqlalchemy.sqlalchemy_db.session.close()
            kiosksqlalchemy.sqlalchemy_db.session.close_all()
            kiosksqlalchemy.sqlalchemy_db.engine.dispose()
