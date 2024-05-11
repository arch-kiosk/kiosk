import pytest
import datetime

import kioskglobals
import kiosklib
import kioskstdlib
from kioskstdlib import *
from test.testhelpers import KioskPyTestHelper
from kioskpatcher import KioskPatcher

test_path = os.path.dirname(os.path.abspath(__file__))

config_file = os.path.join(test_path, r"config", "test_kiosk_config.yml")
sql = os.path.join(test_path, "sql", "add_users.sql")

log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskPatcher(KioskPyTestHelper):

    @pytest.fixture()
    def cfg(self, shared_datadir):
        config = self.get_config(config_file, log_file=log_file)
        config.config["transfer_dir"] = str(shared_datadir)
        return config

    def test_init(self, cfg):
        assert cfg.kiosk

        kioskpatcher = KioskPatcher(cfg, str(cfg.get_transfer_dir(check_unpack_kiosk=False)))
        assert kioskpatcher
        assert kioskpatcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init"
            }
        }) == (True, "")

    def test_file_version(self, cfg):
        assert cfg.kiosk

        kioskpatcher = KioskPatcher(cfg, str(cfg.get_transfer_dir(check_unpack_kiosk=False)))
        assert kioskpatcher
        rc = kioskpatcher.read_patch_file(patch_file={
            "header": {
                "version": 0.2
            },
            "patch": {
                "id": "test_file_version"
            }
        })
        assert not rc[0] and "expected was max" in rc[1]

    def test__check_max_version(self, cfg):
        assert cfg.kiosk
        kioskglobals.kiosk_version = '1.5.33.5'

        kioskpatcher = KioskPatcher(cfg, str(cfg.get_transfer_dir(check_unpack_kiosk=False)))
        assert kioskpatcher
        rc = kioskpatcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "resulting_kiosk_version": "1.5.33.5"
            }
        })
        assert rc[0]
        rc = kioskpatcher._check_max_version()
        assert not rc[0] and "is already on " in rc[1]

        rc = kioskpatcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init"
            }
        })
        assert rc[0]
        rc = kioskpatcher._check_max_version()
        assert rc[0] and rc[1] == ""

        rc = kioskpatcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "resulting_kiosk_version": "1.5.33.6"
            }
        })
        assert rc[0]
        rc = kioskpatcher._check_max_version()
        assert rc[0] and rc[1] == ""

    def test__check_min_version(self, cfg):
        assert cfg.kiosk
        kioskglobals.kiosk_version = '1.5.33.5'

        kioskpatcher = KioskPatcher(cfg, str(cfg.get_transfer_dir(check_unpack_kiosk=False)))
        assert kioskpatcher
        rc = kioskpatcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "min_kiosk_version": "1.5.33.6"
            }
        })
        assert rc[0]
        rc = kioskpatcher._check_min_version()
        assert not rc[0] and "expects kiosk to be at least version" in rc[1]

        rc = kioskpatcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "min_kiosk_version": "1.5.33.5"
            }
        })
        assert rc[0]
        rc = kioskpatcher._check_min_version()
        assert rc[0] and rc[1] == ""

        rc = kioskpatcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init"
            }
        })
        assert rc[0]
        rc = kioskpatcher._check_min_version()
        assert rc[0] and rc[1] == ""

    def test__check_required_version(self, cfg):
        assert cfg.kiosk
        kioskglobals.kiosk_version = '1.5.33.5'

        kioskpatcher = KioskPatcher(cfg, str(cfg.get_transfer_dir(check_unpack_kiosk=False)))
        assert kioskpatcher
        rc = kioskpatcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "required_kiosk_version": "1.5.33.6"
            }
        })
        assert rc[0]
        rc = kioskpatcher._check_required_version()
        assert not rc[0] and "requires Kiosk at exactly version" in rc[1]

        rc = kioskpatcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "required_kiosk_version": "1.5.33.4"
            }
        })
        assert rc[0]
        rc = kioskpatcher._check_required_version()
        assert not rc[0] and "requires Kiosk at exactly version" in rc[1]

        rc = kioskpatcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "required_kiosk_version": "1.5.33.5"
            }
        })
        assert rc[0]
        rc = kioskpatcher._check_required_version()
        assert rc[0] and rc[1] == ""

        rc = kioskpatcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
            }
        })
        assert rc[0]
        rc = kioskpatcher._check_required_version()
        assert rc[0] and rc[1] == ""

    def test_patch_can_run(self, cfg):
        assert cfg.kiosk
        kioskglobals.kiosk_version = '1.5.33.5'

        kiosk_patcher = KioskPatcher(cfg, str(cfg.get_transfer_dir(check_unpack_kiosk=False)[1]))
        assert kiosk_patcher
        kiosk_patcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
            }
        })
        rc = kiosk_patcher.patch_can_run()
        assert rc[0]

        kiosk_patcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "min_kiosk_version": "1.5.33.5",
                "required_kiosk_version": "1.5.33.5",
                "resulting_kiosk_version": "1.5.33.6"
            }
        })
        rc = kiosk_patcher.patch_can_run()
        assert rc[0]

        kiosk_patcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "min_kiosk_version": "1.5.33.5",
                "required_kiosk_version": "1.5.33.5",
                "resulting_kiosk_version": "1.5.33.4"
            }
        })
        rc = kiosk_patcher.patch_can_run()
        assert not rc[0]

        kiosk_patcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "min_kiosk_version": "1.5.33.5",
                "required_kiosk_version": "1.5.33.4",
                "resulting_kiosk_version": "1.5.33.5"
            }
        })
        rc = kiosk_patcher.patch_can_run()
        assert not rc[0]

        kiosk_patcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "min_kiosk_version": "1.5.33.6",
                "required_kiosk_version": "1.5.33.5",
                "resulting_kiosk_version": "1.5.33.5"
            }
        })
        rc = kiosk_patcher.patch_can_run()
        assert not rc[0]

    def test_patch_needs_restart(self, cfg):
        assert cfg.kiosk
        kioskglobals.kiosk_version = '1.5.33.5'

        kiosk_patcher = KioskPatcher(cfg, str(cfg.get_transfer_dir(check_unpack_kiosk=False)[1]))
        assert kiosk_patcher
        kiosk_patcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "needs_restart": "False"
            }
        })
        rc = kiosk_patcher.needs_restart()
        assert not rc

        kiosk_patcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "needs_restart": True
            }
        })
        rc = kiosk_patcher.needs_restart()
        assert rc

        kiosk_patcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "init",
                "needs_restart": "False",
                "unpackkiosk": True
            }
        })
        rc = kiosk_patcher.needs_restart()
        assert rc

    def test_start_shell_script(self, cfg, shared_datadir):
        assert cfg.kiosk
        print(shared_datadir)
        kioskglobals.kiosk_version = '1.5.33.5'

        kiosk_patcher = KioskPatcher(cfg,
                                     str(cfg.get_transfer_dir(check_unpack_kiosk=False)[1]),
                                     patch_file={
                                         "header": {
                                             "version": 0.3
                                         },
                                         "patch": {
                                             "id": "start_shell_script",
                                             "start_script": "test_script1.ps1"
                                         }
                                     })
        assert kiosk_patcher
        rc = kiosk_patcher.apply_patch()
        assert rc == (False, "an error from the script")

    def test_start_python_script(self, cfg, shared_datadir):
        assert cfg.kiosk
        print(shared_datadir)
        kioskglobals.kiosk_version = '1.5.33.5'

        kiosk_patcher = KioskPatcher(cfg,
                                     str(cfg.get_transfer_dir(check_unpack_kiosk=False)[1]),
                                     patch_file={
                                         "header": {
                                             "version": 0.3
                                         },
                                         "patch": {
                                             "id": "start_shell_script",
                                             "start_script": "test_script1.py"
                                         }
                                     })
        assert kiosk_patcher
        rc = kiosk_patcher.apply_patch()
        assert rc == (False, "error messsage from python script")

    def test_start_another_python_script(self, cfg, shared_datadir):
        assert cfg.kiosk
        print(shared_datadir)
        kioskglobals.kiosk_version = '1.5.33.5'

        kiosk_patcher = KioskPatcher(cfg,
                                     str(cfg.get_transfer_dir(check_unpack_kiosk=False)[1]),
                                     patch_file={
                                         "header": {
                                             "version": 0.3
                                         },
                                         "patch": {
                                             "id": "start_shell_script",
                                             "start_script": "test_script1.py"
                                         }
                                     })
        assert kiosk_patcher
        rc = kiosk_patcher.apply_patch()
        assert rc == (False, "error messsage from python script")
        kiosk_patcher.read_patch_file(patch_file={
            "header": {
                "version": 0.3
            },
            "patch": {
                "id": "start_shell_script",
                "start_script": "test_script2.py"
            }
        })
        rc = kiosk_patcher.apply_patch()
        assert rc == (True, "")
