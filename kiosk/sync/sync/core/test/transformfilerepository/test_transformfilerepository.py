import logging

import pytest
import os
import synchronization
from filerepository import FileRepository
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper
from transformfilerepository import TransformFileRepository
# import console
from kiosksqldb import KioskSQLDb

init_done = False

test_path = os.path.dirname(os.path.abspath(__file__))
base_path = KioskPyTestHelper.get_kiosk_base_path_from_test_path(test_path)
config_file = os.path.join(test_path, r"config", "urap_test_config.yml")
log_file = os.path.join(test_path, r"data", "test_log.log")

sql_file = os.path.join(test_path, 'sql', 'records.sql')


#  @pytest.mark.skip
class TestTransformFileRepository(KioskPyTestHelper):
    # sync = None
    # file_repository = None
    # cfg = None


    @pytest.fixture(scope='module')
    def cfg(self):
        return self.get_standard_test_config(__file__, test_config_file=config_file)

    def init_app(self, cfg, shared_datadir):
        # logging.basicConfig(format='>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s', level=logging.ERROR)
        # logger = logging.getLogger()
        # logger.setLevel(logging.INFO)
        #
        # logging.info(f"Starting transformation of file repository. Hold on...")
        # SyncConfig._release_config()
        # sync = SyncConfig.get_config({"config_file": config_file})
        cfg._file_repository = os.path.join(shared_datadir, "file_repository")
        assert cfg.database_name == "urap_test"
        assert cfg.get_file_repository() == os.path.join(shared_datadir, "file_repository")
        transform = TransformFileRepository()
        KioskSQLDb.run_sql_script(sql_file)
        return transform

    def test_transform(self, cfg, shared_datadir):
        db = self.get_urapdb(cfg)
        db.close()
        transform = self.init_app(cfg, shared_datadir)
        print(shared_datadir)
        assert transform.transform()
        assert transform.c_moved == 3
        files = ["0a1c8fb5-ec4f-431c-8ba8-256d7ce21822.nef",
                 "0a2b913a-492e-4d0c-a7b5-bbd79c4160a7.tif",
                 "00d076a0-96f1-4c88-a786-ae4981855442.jpg",
                 ]
        file_repository = SyncConfig.get_config().get_file_repository()
        for f in files:
            assert os.path.isfile(file_repository + "\\" + f[0:2] + "\\" + f)
