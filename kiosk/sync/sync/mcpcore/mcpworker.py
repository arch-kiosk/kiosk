import datetime
import logging
import os
import sys
from importlib import import_module, invalidate_caches

import kioskstdlib
from kiosklogger import KioskLogger
from mcpinterface.mcpconstants import MCPJobStatus


def create_new_file_log(log_file, log_level=logging.INFO):
    logging.basicConfig(format='>[%(process)d/%(thread)d: %(module)s.%(levelname)s at %(asctime)s]: %(message)s',
                        level=logging.ERROR)
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    logger.handlers = []

    log_file = log_file.replace("#", "%")
    log_file = datetime.datetime.strftime(datetime.datetime.now(), log_file)
    ch = logging.FileHandler(filename=log_file, delay=True)
    ch.setLevel(log_level)

    formatter = logging.Formatter(
        '>[%(process)d/%(thread)d: %(module)s.%(levelname)s at %(asctime)s]: %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)


# noinspection PyUnboundLocalVariable
def mcp_worker(job_id, kiosk_base_path, config_file, test_mode):
    try:
        log_path = os.path.join(kiosk_base_path, "log")
        pid = os.getpid()
        log_file = os.path.join(log_path, f"MCP_{pid}_#a_#d#m#y-#H#M.log")
        create_new_file_log(log_file)
        config_file = os.path.join(kiosk_base_path, "config", config_file)
        sync_path = os.path.join(kiosk_base_path, 'sync', 'sync')
        sync_core_path = os.path.join(sync_path, 'core')

        sys.path.insert(0, kiosk_base_path)
        sys.path.insert(1, sync_path)
        sys.path.insert(2, sync_core_path)
        sys.path.insert(3, os.path.join(kiosk_base_path, "core"))
        sys.path.insert(4, os.path.join(kiosk_base_path, "core", "sqlalchemy_models"))
        # sys.path.append(kiosk_base_path)
        # sys.path.append(sync_path)
        # sys.path.append(sync_core_path)

        cfg = init_config(config_file, job_id, kiosk_base_path)
        gs = load_general_store(cfg)
        init_system_message_list(gs, cfg)
        job = None

        from sync_config import SyncConfig
        from mcpinterface.mcpconstants import MCPJobStatus
        from kiosksqldb import KioskSQLDb
        from kiosksqldb import KioskSQLDb
        try:
            from testversion import TEST_VERSION
            test_version = TEST_VERSION
        except BaseException:
            test_version = "-0"

        job_status_aborted = int(MCPJobStatus().JOB_STATUS_ABORTED)
        try:
            try:
                logging.info(f"MCP: {job_id} encapsulated by {__file__}")
                logging.info(f"MCP: {job_id} runs within a kiosk environment with code-signature {test_version}.")
                job = init_job(gs, job_id)
                job.validate_job("mcp_worker:")
                job.os_pid = os.getpid()
                module_name, class_name = job.get_worker()
                invalidate_caches()
            except BaseException as e:
                raise Exception(f"{repr(e)} - there will be no further log for this error.")

            if not test_mode:
                import_and_start_worker(cfg, class_name, gs, job, module_name)
        except BaseException as e:
            logging.error(f"mcp_worker: Exception in job {job_id}: {repr(e)}")
            if job:
                try:
                    job.publish_result({"success": False, "message": repr(e)})
                finally:
                    logging.info(f"trying to abort job {job_id}:")
                    job.set_status_to(job_status_aborted)
                    logging.info(f"job {job_id} ABORTED")
        logging.info(f"  PID: {os.getpid()}: worker done.")
        # # I am not entirely sure why this has to be repeated here, but SyncConfig.get_config just returns None
        # cfg = init_config(config_file, job_id, kiosk_base_path)
        # gs = load_general_store(cfg)

    except BaseException as e:
        logging.info(f"  PID({os.getpid()}): Exception {repr(e)}")
        logging.info(f"  PID({os.getpid()}): job-id {job_id}")
        logging.info(f"  PID({os.getpid()}): kiosk_base_path {kiosk_base_path}")
        logging.info(f"  PID({os.getpid()}): using config {config_file}")

    finally:
        try:
            KioskSQLDb.release_thread_con()
        except BaseException as e:
            logging.error(f"PID({os.getpid()}): Exception when releasing database connection: {repr(e)}")


def init_job(gs, job_id):
    from mcpinterface.mcpjob import MCPJob
    job = MCPJob(gs, job_id)
    return job


def init_config(config_file, job_id, kiosk_base_path):
    from sync_config import SyncConfig
    import kioskstdlib
    cfg = SyncConfig.get_config({'config_file': config_file,
                                 'base_path': kiosk_base_path}, log_warnings=False)
    # return
    if not cfg:
        raise Exception(f"  PID({os.getpid()}): Configuration file {config_file} cannot be loaded.")
    log_file = cfg.get_logfile()
    log_level = cfg.get_log_level()
    if log_file:
        log_path = kioskstdlib.get_file_path(log_file)
        log_file = f"MCP_{os.getpid()}_" + kioskstdlib.get_filename(log_file)
        log_file = os.path.join(log_path, log_file)
        create_new_file_log(log_file, log_level)
    logging.info(sys.path)
    logging.info(f"  PID({os.getpid()}): worker starting job {job_id}")
    logging.info(f"  PID({os.getpid()}): in {kiosk_base_path}")
    logging.info(f"  PID({os.getpid()}): using config {config_file}")
    logging.info(f"  PID({os.getpid()}): worker loads kiosk now:")
    logging.info(f"  PID({os.getpid()}): config project id is {cfg.get_project_id()}.")
    return cfg


def uninstall_log_handler(kiosk_logger):
    if kiosk_logger:
        kiosk_logger.uninstall_log_handler()
    return None


def install_log_handler(job):
    if job.capture_log:
        logging.debug(f"Kiosk Logger installed for job {job.job_id}.")
        kiosk_logger = KioskLogger(log_level=logging.INFO)
        kiosk_logger.install_log_handler()
        return kiosk_logger
    else:
        return None


def import_and_start_worker(cfg, class_name, gs, job, module_name):
    kiosk_logger = None
    globals()["kiosk_mcp_worker"] = True
    assert "kiosk_mcp_worker" in globals()
    try:
        module = import_module(module_name)
        cls = getattr(module, class_name)
        worker = cls(cfg, job, gs)
    except BaseException as e:
        raise e.__class__(f"When loading worker: {repr(e)}")
    try:
        if job.capture_log:
            logging.debug(f"job log IS captured for job {job.job_id}")
            kiosk_logger = install_log_handler(job)
        worker.start()
        if job.capture_log:
            has_errors = kiosk_logger.has_new_errors(reset=False)
            has_warnings = kiosk_logger.has_new_warnings(reset=False)
            result = job.result
            result["has_warnings"] = has_warnings
            result["has_errors"] = has_errors
            job.publish_result(result)
        else:
            logging.debug(f"job log IS NOT captured for job {job.job_id}")
        if job.status < MCPJobStatus.JOB_STATUS_CANCELLING:
            job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
        else:
            if job.status == MCPJobStatus.JOB_STATUS_CANCELLING:
                job.set_status_to(MCPJobStatus.JOB_STATUS_CANCELLED)
    except BaseException as e:
        try:
            job.set_status_to(MCPJobStatus.JOB_STATUS_ABORTED)
            job.publish_result({"success": False, "message": repr(e)})
        except BaseException as _:
            pass
        raise e.__class__(f"Within worker code: {repr(e)}")
    finally:
        if kiosk_logger:
            job.publish_log_lines(kiosk_logger.get_log())
            uninstall_log_handler(kiosk_logger)
        else:
            logging.debug(f"NO KIOSK LOGGER INSTALLED for job {job.job_id}")


def load_general_store(cfg):
    from sync_plugins.redisgeneralstore.redisgeneralstore import RedisGeneralStore

    gs_id = ""
    try:
        gs_id = cfg.config["gs_id"]
    except:
        pass

    return RedisGeneralStore(cfg, gs_id=gs_id)


def init_system_message_list(gs, cfg):
    try:
        from messaging.systemmessagestore import SystemMessageStore
        from messaging.systemmessagestorepostgres import SystemMessageStorePostgres
        from messaging.systemmessagelist import SystemMessageList

        from sync_config import SyncConfig
        cfg = SyncConfig.get_config()
        if not cfg:
            logging.debug(f"PID({os.getpid()}).store_system_message_list: no config.")

        message_list = SystemMessageList(general_store=gs, project_id=cfg.get_project_id())

        store = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                   on_store=SystemMessageStorePostgres.store)
        message_list.assign_store(store)
        message_list.sync(two_way=True)
        logging.debug(f"PID({os.getpid()})/init_system_message_list: system messaging initialized.")
    except BaseException as e:
        logging.error(f"PID({os.getpid()})/init_system_message_list: Exception {repr(e)}")
