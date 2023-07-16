import contextlib
import inspect
import logging
import os
import sys
import time
import datetime

from collections import OrderedDict
from threading import Thread

from blessed import Terminal

from mcpcore.mcp import MCP, MCP_VERSION, MCPCancelledError
from mcpinterface.mcpconstants import MCPJobStatus
from mcpinterface.mcpjob import MCPJob
from mcpinterface.mcpqueue import MCPQueue

SLEEP_AFTER_SEC = 10


class MCPView:

    def __init__(self, general_store):
        self.gs = general_store
        self.refresh_screen = True
        self.queue = OrderedDict()
        self.in_debug_mode = False

    def async_refresh_screen(self, queue: OrderedDict):
        self.refresh_screen = True
        self.queue = OrderedDict(queue)

    def update_screen(self):
        raise NotImplementedError

    @contextlib.contextmanager
    def init_view(self):
        raise NotImplementedError


class MCPTerminalView(MCPView):
    def __init__(self, general_store):
        super(MCPTerminalView, self).__init__(general_store)
        self.term = Terminal()
        self.term.stream.write(self.term.hide_cursor)
        self.term.stream.flush()
        self.term.stream.write(self.term.enter_fullscreen)
        self.term.stream.flush()
        self.bg_green = (136, 170, 0)
        self.bg_red = (191, 44, 44)
        self.bg_grey = (140, 140, 140)
        self.keys = {"quit": "[Q] to Quit",
                     "select": "[\u2190],[\u2191],[\u2192],[\u2193] select job",
                     "wakeup": "Any key to wake up."}
        self.active_menu_items = []
        self.refresh_counter = 0
        self.pulse_colors = [(191, 44, 44), (136, 170, 0), (124, 155, 0), (204, 255, 0)]

    @contextlib.contextmanager
    def init_view(self):
        with self.term.hidden_cursor(), self.term.cbreak():
            yield

    def restore_terminal(self):
        self.term.stream.write(self.term.exit_fullscreen)
        self.term.stream.flush()
        self.term.stream.write(self.term.normal_cursor)
        self.term.stream.flush()

    def update_pulse(self):
        queue = MCPQueue(self.gs)
        alive_count = queue.is_mcp_alive()
        if alive_count > 0:
            alive_count = 1 + alive_count % 3

        print(self.term.move_xy(x=self.term.width - 8, y=0), end="")
        if alive_count == 1:
            print(self.term.black, end="")
        else:
            print(self.term.color_rgb(*self.bg_red), end="")
        print(self.term.on_color_rgb(*self.pulse_colors[alive_count]) +
              self.term.ljust("=^..^=", width=6), end="")

        print(self.term.move_xy(x=self.term.width - 8, y=1), end="")
        print(self.term.on_color_rgb(*self.pulse_colors[alive_count]) +
              self.term.ljust('(")(")', width=6), end="")

        print(self.term.black)
        return 8

    def toggle_menu(self, key_id):
        if key_id in self.active_menu_items:
            self.active_menu_items.remove(key_id)
        else:
            self.active_menu_items.append(key_id)
        self.menu()
        time.sleep(.1)

    def header(self):
        pulse_width = self.update_pulse()
        with self.term.location(y=0):
            if self.in_debug_mode:
                print(self.term.black + self.term.on_color_rgb(*self.bg_red) +
                      self.term.ljust(f"Kiosk Master Control Program {MCP_VERSION}",
                                      width=self.term.width - pulse_width))
                print(self.term.on_color_rgb(*self.bg_red) +
                      self.term.ljust(f"using {config_file} and in debug mode", width=self.term.width - pulse_width))
            else:
                print(self.term.black + self.term.on_color_rgb(*self.bg_green) +
                      self.term.ljust(f"Kiosk Master Control Program {MCP_VERSION}",
                                      width=self.term.width - pulse_width))
                print(self.term.on_color_rgb(*self.bg_grey) +
                      self.term.ljust(f"using {config_file}", width=self.term.width - pulse_width))

        self.menu()

    def menu(self):
        with self.term.location(y=2):
            print(self.term.black + self.term.on_color_rgb(*self.bg_green) + "Press", end=self.term.on_black + " ")
            spacer = ""
            for key_id, menu in self.keys.items():
                if key_id == "wakeup":
                    if self.refresh_counter < SLEEP_AFTER_SEC:
                        continue
                print(self.term.on_color_rgb(*self.bg_green), end="")
                print(self.term.black + spacer, end="")
                if key_id in self.active_menu_items:
                    print(self.term.on_color_rgb(*self.bg_red), end="")
                else:
                    print(self.term.on_color_rgb(*self.bg_green), end="")
                print(" " + menu + " ", end="")
                spacer = self.term.on_black + " "

        print(self.term.on_black, end="")

    @staticmethod
    def get_max_width(texts: list):
        max_width = 0
        for t in texts:
            l = len(t)
            if l > max_width:
                max_width = l
        return max_width

    def print_in_rect(self, x, y, back_color, color, max_width, texts: list):
        height = len(texts) + 2
        term = self.term
        print(f"{term.move_xy(x, y)}{term.on_black} {back_color}{color}" +
              term.ljust(f" "[:max_width - 1], max_width - 1),
              end="")
        y += 1
        for s in texts:
            print(f"{term.move_xy(x, y)}{term.on_black} {back_color}{color}" +
                  term.ljust(f" {s} "[:max_width - 1], max_width - 1),
                  end="")
            y += 1
        print(f"{term.move_xy(x, y)}{term.on_black} {back_color}{color}" +
              term.ljust(f" "[:max_width - 1], max_width - 1),
              end="")

        return height

    def job_list(self):
        term = self.term
        if self.queue:
            y = 4
            x = 0
            max_height = 4
            with term.location(y=y):
                for job_id, job in reversed(self.queue.items()):
                    job: MCPJob
                    try:
                        progress = job.progress.get_progress_dict()
                        if progress == {}:
                            progress = ""
                        else:
                            progress = f"{progress}"
                    except BaseException as e:
                        progress = ""
                    try:
                        result = "result: " + str(f"{job.result['success']}")
                    except BaseException as e:
                        result = ""
                    lines = [f"{job.project_id}-Job {job.job_id}: {MCPJobStatus.STATUS_TO_STR[job.status]}",
                             f"created: {job.get_job_info_attribute('ts_created')}",
                             f"worker: {job.get_worker()[1]}: {result}",
                             f"{progress}"]
                    max_width = self.get_max_width(lines)
                    max_width = term.width if max_width + 3 > term.width else max_width + 3
                    if x + max_width > term.width:
                        x = 0
                        y += max_height + 1
                    if MCPJobStatus.JOB_STATUS_RUNNING <= job.status < MCPJobStatus.JOB_STATUS_DONE:
                        bg_color = term.on_color_rgb(*self.bg_green)
                    elif job.status > MCPJobStatus.JOB_STATUS_DONE:
                        bg_color = term.on_color_rgb(*self.bg_red)
                    else:
                        bg_color = term.on_color_rgb(*self.bg_grey)

                    height = self.print_in_rect(x, y, bg_color, term.black, max_width, lines)
                    max_height = max_height if max_height >= height else height
                    x += max_width
        else:
            with term.location(y=term.height // 2):
                print(term.white_on_black + term.center("no registered jobs.", width=term.width), end="")

    def update_screen(self):
        try:
            self.refresh_counter += 1
            if self.refresh_counter < SLEEP_AFTER_SEC:
                print(self.term.clear)
            self.header()
            if self.refresh_counter < SLEEP_AFTER_SEC:
                self.job_list()
            else:
                term = self.term
                with term.location(y=term.height // 2 - (1 - self.refresh_counter % 2)):
                    print(term.white_on_black + term.center(f" z z ", width=term.width), end="")
                with term.location(y=term.height // 2 - (self.refresh_counter % 2)):
                    print(term.white_on_black + term.center(f"z", width=term.width), end="")

        except BaseException as e:
            with self.term.location(y=self.term.height - 1):
                print(self.term.white_on_red + self.term.center(f"Exception in update_screen: {repr(e)}",
                                                                width=self.term.width), end="")
        finally:
            print(self.term.on_black)

    def get_input(self, timeout=.1):
        key = mcp_view.term.inkey(timeout=.01)
        while key:
            self.refresh_counter = 0
            if key == "q":
                self.toggle_menu("quit")
                return {"id": "quit"}
            elif key.is_sequence:
                if key.code in [self.term.KEY_DOWN,
                                self.term.KEY_UP,
                                self.term.KEY_RIGHT,
                                self.term.KEY_LEFT]:
                    self.toggle_menu("select")
                    return self._get_select_command(key.code)

            key = mcp_view.term.inkey(timeout=.01)
        time.sleep(.1)
        return {}

    def _get_select_command(self, key):
        cmd = {"id": "select"}
        if key == self.term.KEY_DOWN:
            cmd["direction"] = "down"
        elif key == self.term.KEY_UP:
            cmd["direction"] = "up"
        elif key == self.term.KEY_LEFT:
            cmd["direction"] = "left"
        elif key == self.term.KEY_LEFT:
            cmd["direction"] = "right"
        return cmd

    def select(self, command):
        self.toggle_menu("select")

    def loop(self, mcp_thread: Thread):
        with self.init_view():
            while True and mcp_thread.is_alive():
                try:
                    command = mcp_view.get_input()
                    if command:
                        if command["id"] == "quit":
                            break
                        if command["id"] == "select":
                            self.select(command)

                    if self.refresh_screen:
                        self.refresh_screen = False
                        mcp_view.update_screen()

                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}. : {repr(e)}")
                    raise e


class MCPLoop:
    def __init__(self, mcp: MCP, mcp_view: MCPView):
        self.mcp = mcp
        self.mcp_view: MCPView = mcp_view
        self.mcp_view.in_debug_mode = mcp.in_debug_mode
        self.cancel = False

    def loop(self):
        i = 0
        while not self.cancel:

            job = self.mcp.next_job()
            try:
                if job:
                    self.mcp.start_job(job)
            except MCPCancelledError as e:
                logging.info(f"{self.__class__.__name__}.loop: MCP Cancelled: {repr(e)}")
                self.cancel = True
                break

            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.loop: Exception in start_job: {repr(e)}")

            # self.mcp.pulse_mcp()
            try:
                self.mcp.collect_garbage()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.loop: Exception in collect_garbage: {repr(e)}")
            if self.mcp_view:
                self.mcp_view.async_refresh_screen(self.mcp.queue)
            time.sleep(1)
            i += 1


def init_logging(cfg):
    # This is to suppress the red lock log entries.
    red_lock_logger = logging.getLogger('redis_lock')
    red_lock_logger.setLevel(logging.ERROR)

    logging.basicConfig(format='>[%(process)d/%(thread)d: %(module)s.%(levelname)s at %(asctime)s]: %(message)s',
                        level=logging.ERROR)
    logger = logging.getLogger()
    logger.setLevel(cfg.get_log_level())
    logger.handlers = []

    return logger


def create_new_file_log(root_path, cfg, logger: logging.Logger):
    if cfg.get_logfile():
        close_all_file_loggers(logger)
        log_file = os.path.join(root_path, "log", "MCP_#a_#d#m#y-#H#M.log")
        log_pattern = log_file.replace("#", "%")

        # todo: This is such a hack. But it makes sure, that two processes do not produce two different logs if
        # the minute is about to expire and the logfile pattern is on a minute basis.
        # Nonetheless, since logging is not multiprocess safe, logging needs to move to REDIS or a database. Not now.
        if datetime.datetime.now().second >= 58:
            time.sleep(3)

        log_file = datetime.datetime.strftime(datetime.datetime.now(), log_pattern)
        ch = logging.FileHandler(filename=log_file)
        ch.setLevel(logging.INFO)

        formatter = logging.Formatter(
            '>[%(process)d/%(thread)d: %(module)s.%(levelname)s at %(asctime)s]: %(message)s')
        ch.setFormatter(formatter)
        logger.addHandler(ch)

        print("--------------- Starting new log %s ------------ \n" % log_file)
        logging.info("--------------- Starting new log %s ------------ \n" % log_file)
    else:
        logging.info("Can't create new log file")


def close_all_file_loggers(logger):
    for handler in logger.handlers:
        if isinstance(handler, logging.FileHandler):
            logger.remove_handler(handler)
            handler.flush()
            handler.close()


if __name__ == '__main__':
    # todo: this part needs to be project-independent AND general store independent - one day.
    # for the time being we just accept a kiosk config file via parameter

    from sync_plugins.redisgeneralstore.redisgeneralstore import RedisGeneralStore
    from sync_config import SyncConfig

    filename = inspect.getframeinfo(inspect.currentframe()).filename
    root_path = os.path.dirname(os.path.abspath(filename))
    if len(sys.argv) < 2:
        raise Exception("MCP needs the kiosk configuration file as parameter.")
    config_file = sys.argv[1]
    sync_config = SyncConfig.get_config({'config_file': config_file})
    if not sync_config:
        raise Exception(f"Could not load Kiosk configuration from '{config_file}'")
    print(f" ** MCP running within {sync_config.base_path} using {config_file} ** ")

    in_debug_mode = False
    if len(sys.argv) > 2:
        param = sys.argv[2]
        if param == "--debug":
            in_debug_mode = True
        else:
            raise Exception(f"Unknown parameter '{sys.argv[2]}'")

    logger = init_logging(sync_config)

    create_new_file_log(root_path, sync_config, logger)
    logging.info(f" ** MCP {MCP_VERSION} running within {sync_config.base_path} using {config_file} ** ")

    gs = RedisGeneralStore(sync_config)
    if not gs.is_running():
        print(f"MCP Terminal, main: Redis not running. Aborting.")
        logging.error(f"ERROR in MCP Terminal, main: Redis not running. Aborting.")
        exit(-1)

    if MCPQueue(gs).is_mcp_alive():
        print(f"MCP Terminal, main: There is another system. Aborting. (Please wait 10 seconds and try again)")
        logging.error(f"ERROR in MCP Terminal, main: Attempt to start MCP twice.")
        exit(0)

    mcp_instance = MCP(gs)
    mcp_instance.in_debug_mode = in_debug_mode
    mcp_instance.publish_version()
    mcp_view = MCPTerminalView(gs)
    mcp_loop = MCPLoop(mcp_instance, mcp_view)
    try:
        mcp_thread = Thread(target=mcp_loop.loop)
        mcp_thread.start()
        mcp_view.loop(mcp_thread)
        mcp_loop.cancel = True
        mcp_view.restore_terminal()
    except BaseException as e:
        mcp_view.restore_terminal()
        print(f"Exception: {repr(e)}")
        logging.error(f"{repr(e)}")
    finally:
        mcp_loop.cancel = True
