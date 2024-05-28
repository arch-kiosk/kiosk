import logging
import os
import pprint
import shutil
from typing import Union, Callable, List, Iterator, Tuple

import kioskstdlib
from jinjafilters import newline_to_br, format_datetime
from sync_plugins.reportinghtmldriver.reportingmapperhtml import ReportingMapperHTML
from sync_plugins.reportingdock.reportingoutputdriver import ReportingOutputDriver
from synchronization import Synchronization
from synchronizationplugin import SynchronizationPlugin
from datetime import date
from jinja2 import Environment, FileSystemLoader, select_autoescape


# ************************************************************************
# Plugin code for ReportingPDFDriver
# ************************************************************************
class PluginReportingHTMLDriver(SynchronizationPlugin):
    _plugin_version = 0.1

    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            ReportingHTMLDriver.register(app.type_repository)
            logging.debug("PluginReportingHTMLDriver: plugin and driver type registered")
        else:
            logging.error("PluginReportingHTMLDriver: plugin and driver type could not be registered due to no app.")
            return False

        return True


# ************************************************************************
# ReportingHTMLDriver
# ************************************************************************
class ReportingHTMLDriver(ReportingOutputDriver):
    can_view = True
    can_download = False
    can_zip = False

    rendered_sub_templates = []

    @classmethod
    def get_supported_file_extensions(cls):
        return ["html"]

    def __init__(self):
        super().__init__()
        self.main_report_file = ""

    def _get_mapper_class(self):
        return ReportingMapperHTML

    def _prepare_file(self) -> str:
        target_filename = os.path.join(self.target_dir, self.target_file_name_without_extension + ".html")
        return str(target_filename)

    def execute(self, _on_load_records: Union[Callable[[str, List[str]], Iterator[Tuple]], None]) -> str:
        """
        executes the sub-report (for a single arch-context)
        :param _on_load_records: a callable which gets the table_name and the "columns" list and
                                 returns a generator that returns a new row (a tuple with values)
                                 on each iteration
        :returns the path and filename of the target file
        """
        self.check_premisses()

        target_filename = self._prepare_file()
        reporting_sub_dir = kioskstdlib.get_filename(kioskstdlib.get_file_path(target_filename))

        env = Environment(loader=FileSystemLoader(kioskstdlib.get_file_path(self.template_file)),
                          autoescape=select_autoescape())

        env.filters['newline_to_br'] = newline_to_br
        env.filters['format_datetime'] = format_datetime

        sub_template = kioskstdlib.get_filename_without_extension(self.template_file) + "_sub.html"
        if not os.path.isfile(os.path.join(kioskstdlib.get_file_path(self.template_file), sub_template)):
            raise Exception(f"{self.__class__.__name__}.execute: sub_template '{sub_template}' does not exist.")

        template = env.get_template(sub_template)
        template.stream(mapped_values=self._mapped_values).dump(target_filename)
        self.rendered_sub_templates.append("/".join([reporting_sub_dir, kioskstdlib.get_filename(target_filename)]))

        return target_filename

    def get_target_filename(self):
        logging.debug(f"{self.__class__.__name__}.get_target_filename: target_dir is {self.target_dir}, "
                      f"filename is: {kioskstdlib.get_filename(self.template_file)}")
        return os.path.join(self.target_dir, kioskstdlib.get_filename(self.template_file))

    def init(self) -> bool:
        """
        closes the report. This is called only once per run (unlike "execute" which is called for
        every arch-context)
        success: indicates whether the rest of the report ran successfully.
                 If there was an earlier error this will be False.
        :returns: if the operation was successful
        """
        logging.debug(f"{self.__class__.__name__}.init: Initializing ReportingHTMLDriver")
        self.rendered_sub_templates = []
        if not self.target_dir:
            raise Exception(f"{self.__class__.__name__}.init: target_dir not set on initialization")

        if not os.path.exists(self.target_dir):
            try:
                os.mkdir(self.target_dir)
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.init: Error creating target_dir {self.target_dir}: {repr(e)}")

        if not os.path.exists(self.target_dir):
            raise Exception(f"{self.__class__.__name__}.init: target_dir {self.target_dir} was not created.")

        if not os.path.isfile(self.template_file):
            raise Exception(f"{self.__class__.__name__}.execute: template '{self.template_file}' does not exist.")

        try:
            kioskstdlib.clear_dir(self.target_dir)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.init: "
                          f"target_dir {self.target_dir} cannot be cleared: {repr(e)}")

        return True

    def close(self, success: bool) -> bool:
        """
        closes the report. This is called only once per run (unlike "execute" which is called for
        every arch-context)
        success: indicates whether the rest of the report ran successfully.
                 If there was an earlier error this will be False.
        :returns: if the operation was successful
        """
        logging.debug(f"{self.__class__.__name__}.close: closing ReportingHTMLDriver")
        if not success and self.target_dir:
            kioskstdlib.clear_dir(self.target_dir)
        if success:

            env = Environment(loader=FileSystemLoader(kioskstdlib.get_file_path(self.template_file)),
                              autoescape=select_autoescape())
            if not os.path.isfile(self.template_file):
                raise Exception(f"{self.__class__.__name__}.execute: "
                                f"main template '{self.template_file}' does not exist.")

            self.main_report_file = self.get_target_filename()

            template = env.get_template(kioskstdlib.get_filename(self.template_file))
            template.stream(sub_templates=self.rendered_sub_templates).dump(self.main_report_file)
        return True
