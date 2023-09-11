from image_manipulation.manipulationcache import ManipulationImageCache
from image_manipulation.filesource import FileSource
from .qrcodedfile import QRCodedFile
import os
import kioskstdlib
import logging


class QRCodeTester:
    def __init__(self, file_source: FileSource = None, dst_path: str = ""):
        self.decode_qr_result = True
        self._file_source = file_source
        self._strategies = []
        self.dst_path = dst_path
        self._debug_info = {}
        self._debug_counter = 0
        self.debug_cache = False
        self._report_func = self._print_report
        self.stop_on_recognition = True
        self.successful_strategies = {}
        self.file_unrecognized = []
        self.try_original = True
        self.manipulation_cache_size = 10
        self.qr_code_recognized = None

    def register_strategy(self, strategy):
        """
        registers an image manipulation strategy to apply to an image before qr code detection
        :param strategy: an instance of ImageManipulationStrategy
        """
        self._strategies.append(strategy)

    def register_strategies(self, strategies):
        """
        registers a list of manipulation strategies each of which to apply to an image before qr code detection
        :param strategies: List or Generator that holds instances of ImageManipulationStrategy
        """
        for strategy in strategies:
            self.register_strategy(strategy)

    @staticmethod
    def _get_dest_filename(src_path_filename, dst_file_path, strategy):
        dst_file_path = os.path.join(dst_file_path, strategy.name)
        if not os.path.isdir(dst_file_path):
            os.makedirs(dst_file_path, exist_ok=True)

        path_and_filename = os.path.join(dst_file_path, kioskstdlib.get_filename(src_path_filename))
        return path_and_filename

    @staticmethod
    def _print_report(qrcode_file: str, strategy_name: str, data, success: str):
        print(f"{kioskstdlib.get_filename(qrcode_file)}, {strategy_name}, {success}, {data}")

    def set_report_func(self, func):
        self._report_func = func

    def _debug_strategy(self, img, manipulation_name):
        self._debug_counter += 1
        dest_debug_path = os.path.join(self.dst_path, "debug", self._debug_info["strategy"])
        os.makedirs(dest_debug_path, exist_ok=True)
        debug_filename = f"{self._debug_counter}_{manipulation_name}" \
                         f"_{kioskstdlib.get_filename(self._debug_info['dest_file'])}"
        logging.debug(f"saving manipulation step {manipulation_name}")
        debug_path_and_filename = os.path.join(dest_debug_path, debug_filename)

        img.save(debug_path_and_filename)
        qrcode = QRCodedFile(debug_path_and_filename)
        result = qrcode.decode(scan_only=True)
        if result:
            new_filename = os.path.join(dest_debug_path, "ok_" + debug_filename)
        else:
            new_filename = os.path.join(dest_debug_path, "fail_" + debug_filename)
        os.rename(debug_path_and_filename, new_filename)

    def decode_file(self, qrcode_file: str):
        """
        tries to decode a file by means of the registered strategies. What exactly is encoded in the
        qr code does not matter here. Moreover this function tries to score the strategies and reports
        their results so that the best strategies can be identified.
        Use this only for learning which strategies work with which QR Codes best in an interactive console mode.

        :param qrcode_file: the QRCodeFile object pointing to the source file
        :return: True or False. The properties file_unrecognized and successful_strategies show what strategies
                 proved to be useful. The process is also logged to the screen with further information.
        :except: Exception if not destination path is given.
        """
        if not self.dst_path:
            raise Exception("QRCodeTester.decode_file: No destination path given.")

        manipulation_image_cache = ManipulationImageCache(self.manipulation_cache_size)
        if self.try_original:
            if self._try_decode(qrcode_file, qrcode_file, "original"):
                self._score_strategy("original")

        self.file_unrecognized.append(kioskstdlib.get_filename(qrcode_file))
        decoded = False
        for strategy in self._strategies:
            # self._report_func(qrcode_file, strategy.name, {}, f"trying "
            #                                                   f"{qrcode_file} and strategy {strategy.name}.")
            dest_file = self._get_dest_filename(qrcode_file, self.dst_path, strategy)
            debug_method = None
            if strategy.debug:
                self._debug_counter = 0
                self._debug_info["dest_file"] = dest_file
                self._debug_info["strategy"] = strategy.name
                debug_method = self._debug_strategy

            strategy.set_manipulation_cache(manipulation_image_cache)
            if self.debug_cache:
                manipulation_image_cache.debug_out()

            try:
                if strategy.execute(qrcode_file, dest_file, debug_method=debug_method):
                    strategy_result_file = strategy.get_result_path_and_filename()
                    if self._try_decode(strategy_result_file, qrcode_file, strategy.name):
                        decoded = True
                        self._score_strategy(strategy.name)
                        basename = kioskstdlib.get_filename(qrcode_file)
                        if basename in self.file_unrecognized:
                            self.file_unrecognized.remove(basename)

                        if self.stop_on_recognition:
                            break
                else:
                    self._report_func(qrcode_file, strategy.name, {}, "strategy failed")
            except BaseException as e:
                self._report_func(qrcode_file, strategy.name, {}, f"Error with file "
                                                                  f"{qrcode_file} and strategy {strategy.name}: "
                                                                  f"{repr(e)}")

        return decoded

    def _try_decode(self, strategy_result_file: str, src_file: str, strategy_name):
        result = False
        if strategy_result_file:
            qrcode = QRCodedFile(strategy_result_file)
            try:
                if qrcode.decode(scan_only=(not self.decode_qr_result)):
                    self._report_func(src_file, strategy_name, qrcode.data, "ok")
                    result = True
                else:
                    self._report_func(src_file, strategy_name, {}, "no qrcode")
            except BaseException as e:
                self._report_func(src_file, strategy_name, qrcode.data, repr(e))
        else:
            self._report_func(src_file, strategy_name, {}, "no dest file")

        return result

    def quick_decode(self, qrcode_file: str):
        """
        Fastest method to try a bunch of recognition strategies on a file.
        :param qrcode_file: the source file as a QRCodeFile object
        :return: the recognized data (a string) or an empty string. No further logging will be done
                 to achieve the fastest result.
        """
        manipulation_image_cache = ManipulationImageCache(self.manipulation_cache_size)

        decoded = ""
        self.qr_code_recognized = None
        if len(self._strategies) == 0:
            logging.warning("QrCodeTester.quick_decode: No registered strategies, so there is nothing to do.")

        for strategy in self._strategies:
            strategy.set_manipulation_cache(manipulation_image_cache)
            if self.debug_cache:
                manipulation_image_cache.debug_out()
            if strategy.execute(qrcode_file):
                qrcode = QRCodedFile()
                try:
                    if qrcode.quick_decode(strategy.get_result_np_array()):
                        self.qr_code_recognized = qrcode
                        decoded = self.qr_code_recognized.data
                        logging.debug(
                            f"Success for QRCode in image {kioskstdlib.get_filename(qrcode_file)}: "
                            f"{decoded}")
                        break
                    else:
                        logging.debug(
                            f"QRCode in image {kioskstdlib.get_filename(qrcode_file)} "
                            f"could not be decoded.")

                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.quick_decode(): {repr(e)}")

        return decoded

    def execute(self, quick_decode=False):
        """
        executes all the strategies on all the files the file source generates.
        :return: c_files, c_files_decoded which is. Number of files scanned,
                 number of successfully recognized qr codes
        """
        c_files = 0
        c_files_decoded = 0
        file = ""
        try:
            for file in self._file_source.next_file():
                c_files += 1
                if quick_decode:
                    decoded = self.quick_decode(file)
                else:
                    decoded = self.decode_file(file)

                if decoded:
                    c_files_decoded += 1

                if self._report_func:
                    self._report_func(file, "", None, "recognized" if decoded else "not recognized")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.execute: Error decoding {file} {repr(e)}")
            raise e
        return c_files, c_files_decoded

    def save_report(self):
        raise NotImplementedError

    def _score_strategy(self, name):
        c = 0
        if name in self.successful_strategies:
            c = self.successful_strategies[name]
        c += 1
        self.successful_strategies[name] = c
