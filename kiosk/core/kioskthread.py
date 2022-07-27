import threading
import logging
import queue
from kiosklogger import KioskLogger


class KioskThread:
    def __init__(self):
        self.urap_lock = threading.Lock()
        self.locked = False
        self.thread_running = False
        self.thread_progress = 0
        self.extended_progress = 0
        self.q = queue.Queue()
        self.results = {}

        self.kiosk_logger = KioskLogger()
        self.kiosk_logger.setLevel(logging.INFO)
        self.kiosk_logger.set_info_filter(["werkzeug"])
        formatter = logging.Formatter('>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s')
        self.kiosk_logger.setFormatter(formatter)

    def is_running(self):
        return self.thread_running

    def get_progress(self):
        return self.thread_progress

    def lock(self):
        rc = False
        try:
            rc = self.urap_lock.acquire(blocking=False)
            if rc:
                print("\n>>>> LOCKED\n")
                self.locked = True
        except Exception as e:
            logging.error("Exception in KioskThread.lock: " + repr(e))
            try:
                self.unlock()
            except:
                pass
        return rc

    def unlock(self):
        try:
            print("\n>>>> LOCK RELEASED\n")
            self.urap_lock.release()
            logging.debug("kioskthread.lock.unlock successful")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.unlock() : {repr(e)}")
        finally:
            self.locked = False

    def thread_func(self, target, args, q, t):
        self.thread_running = True
        self.thread_progress = 0
        self.extended_progress = 0

        try:
            logger = logging.getLogger()
            logger.addHandler(t.kiosk_logger)
        except Exception as e:
            logging.error("Non-fatal Exception in thread_func: " + repr(e))

        try:
            target(*args, q, t)
            try:
                logger.removeHandler(self.kiosk_logger)
            except Exception as e:
                logging.error("Non-fatal Exception in thread_func: " + repr(e))
        except Exception as e:
            logging.error("Exception in KioskThread.thread_func: " + repr(e))
        finally:
            if self.self_unlock:
                self.unlock()
            self.thread_running = False
            self.thread_progress = 100
            try:
                logger.removeHandler(self.kiosk_logger)
            except Exception as e:
                logging.error("Non-fatal Exception in thread_func: " + repr(e))

    def execute(self, target, args, wait, self_unlock):
        try:
            rc = False
            self.thread_progress = 0
            self.self_unlock = self_unlock

            if self.locked:
                urap_thread = threading.Thread(target=self.thread_func,
                                               name="kiosk_thread",
                                               args=(target, args, self.q, self))
                if urap_thread:
                    urap_thread.start()
                    if wait:
                        urap_thread.join()
                        if self.self_unlock:
                            self.unlock()
                    rc = True
            else:
                logging.error("Attempt to execute thread without lock. That's not allowed.")

        except Exception as e:
            logging.error("Exception in KioskThread.execute: " + repr(e))
        return(rc)

    def get_result(self, result_name):
        while True:
            if not self.q.empty():
                t = self.q.get()
                self.results[t[0]] = t[1]
            else:
                break
        if result_name in self.results:
            return(self.results[result_name])
        else:
            return(None)

    def report_progress(self, prg):
        if "progress" in prg:
            self.thread_progress = prg["progress"]

    def get_log(self):
        if self.kiosk_logger:
            return(self.kiosk_logger.get_log())
        else:
            return([])

    def last_action_had_warnings(self):
        if self.kiosk_logger:
            return(self.kiosk_logger.has_new_warnings())
        else:
            return(False)

    def last_action_had_errors(self):
        if self.kiosk_logger:
            return(self.kiosk_logger.has_new_errors())
        else:
            return(False)
