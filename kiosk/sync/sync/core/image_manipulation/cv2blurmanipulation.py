import cv2
from image_manipulation.imagemanipulation import ImageManipulation


class CV2BlurManipulation(ImageManipulation):
    def __init__(self, blur_factor: float):
        self.blur_factor = blur_factor

    def execute_manipulation(self, image):
        new_image = cv2.medianBlur(image, self.blur_factor)
        return new_image

    def get_parameters(self):
        return ["blur", self.blur_factor]
