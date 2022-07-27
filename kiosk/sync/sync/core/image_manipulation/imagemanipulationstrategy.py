import kioskstdlib
import logging
from image_manipulation.imagemanipulation import ImageManipulation
from image_manipulation.manipulationcache import ManipulationImageCache


class ImageManipulationStrategy:
    """ a base class that all image manipulation strategies need to derive from """

    def __init__(self, name: str, debug=False, manipulation_image_cache: ManipulationImageCache = None):
        self.name = name
        self.debug = debug
        self.src_file = None
        self.manipulation_list = []
        self.dest_file_name = ""
        self._result_np_array = None
        if manipulation_image_cache:
            self._manipulation_image_cache = manipulation_image_cache
        else:
            self._manipulation_image_cache = ManipulationImageCache()

    def set_manipulation_cache(self, manipulation_cache: ManipulationImageCache):
        if manipulation_cache:
            self._manipulation_image_cache = manipulation_cache

    def _isnull(self, img) -> bool:
        raise NotImplementedError

    def execute(self, src_file: str, dst_path_and_filename: str = "",
                debug_method=None) -> bool:
        """
        executes the algorithm(s) of this strategy.
        :param src_file: path and filename of the input file as a string
        :param dst_path_and_filename: if not empty the path and filename of the result file. If empty the result will
                not be saved to a file. Instead the result is stored in a numpy array, accessible via
                get_result_np_array
        :param debug_method: a method of signature (img, name:str ) that is called
               with every single image that is created during the process.
        :return: True or false. In the case of True the result image is either saved in the file or in the numpy array.
        """
        self.src_file = src_file
        filename = kioskstdlib.get_filename(src_file)
        rc = False
        try:
            img = self._cached_open(src_file)
            if not self._isnull(img):
                cache_index = [filename]
                for manipulation in self.manipulation_list:
                    cache_index.extend([manipulation.__class__.__name__])
                    cache_index.extend(manipulation.get_parameters())
                    try:
                        cache_img = self._manipulation_image_cache.get(cache_index)
                        img = cache_img
                    except KeyError:
                        logging.debug(f"no cache image for {cache_index}")
                        img = manipulation.execute_manipulation(img)
                        if not self._isnull(img):
                            self._manipulation_image_cache.add(cache_index, img)

                    if self._isnull(img):
                        logging.error(f"manipulation {manipulation.__class__.__name__} failed on "
                                      f"{src_file}")
                        break

                    if self.debug and debug_method:
                        debug_method(img, manipulation.__class__.__name__)

                if not self._isnull(img):
                    self._save_result(dst_path_and_filename, img)
                    rc = True
            else:
                logging.error(f"{self.__class__.__name__}.execute_recognition_algorithm: "
                              f"Can't open {src_file}")

        except IOError as e:
            logging.error(f"{self.__class__.__name__}.execute_recognition_algorithm:"
                          f"{repr(e)}")
        return rc

    def _save_result(self, dst_path_and_filename, img):
        """
        saves the img either in a numpy-array or as a file, if dst_path_and_filename is given.
        :param dst_path_and_filename: if given, the result will be stored in this file and NOT in a numpy array
        :param img: the image. Because here it is not clear what kind of object that is, _to_np_array and _save_img
                    do the actual saving of this object to a numpy array or a file
        :return no return code but could throw Exceptions
        """
        if dst_path_and_filename:
            self.dest_file_name = dst_path_and_filename
            self._save_image(img)
        else:
            self._result_np_array = self._to_np_array(img)

    def _cached_open(self, src_file):
        """
        opens an image either from a file or, if available, gets it from the manipulation cache.
        if the image is read from a file it is stored in the manipulation cache under its base filename.
        :param src_file: path and filename of the source file
        :return: an object representing the open image.
        """
        filename = ""
        try:
            filename = kioskstdlib.get_filename(src_file)
            img = self._manipulation_image_cache.get([filename])
        except KeyError:
            img = self._open(src_file)
            logging.debug(f"opened code file {filename}")
            self._manipulation_image_cache.add([filename], img)

        return img

    def append_manipulation(self, manipulation: ImageManipulation):
        self.manipulation_list.append(manipulation)

    def get_result_path_and_filename(self):
        return self.dest_file_name

    def get_result_np_array(self):
        return self._result_np_array

    def _to_np_array(self, img):
        raise NotImplementedError

    def _open(self, src_file: str):
        raise NotImplementedError

    def _save_image(self, img):
        raise NotImplementedError
