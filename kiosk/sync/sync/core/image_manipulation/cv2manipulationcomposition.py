import cv2
import kioskstdlib

from image_manipulation.imagemanipulationstrategy import ImageManipulationStrategy


class CV2ManipulationComposition(ImageManipulationStrategy):

    def __init__(self, name: str, debug=False):
        super().__init__(name=name, debug=debug)

    def _save_image(self, img):
        cv2.imwrite(self.dest_file_name, img)

    def _open(self, src_file: str):
        # return cv2.imread(src_file, flags=cv2.IMREAD_GRAYSCALE)
        img = cv2.imread(src_file, flags=cv2.IMREAD_GRAYSCALE)
        # dst_file = kioskstdlib.change_file_ext(src_file, "jpg")
        # cv2.imwrite(dst_file, img)
        return img

    def _isnull(self, img):
        return (img is None) or img.size == 0

    def _to_np_array(self, img):
        if len(img.shape) > 2:
            return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        else:
            new_img = img.copy()
            return new_img
