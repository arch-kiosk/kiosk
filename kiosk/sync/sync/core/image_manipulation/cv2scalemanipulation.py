import cv2
from image_manipulation.imagemanipulation import ImageManipulation


class CV2ScaleManipulation(ImageManipulation):
    def __init__(self, scale_factor: float):
        self.scale_factor = scale_factor

    def execute_manipulation(self, image):
        new_image = cv2.resize(image, None, fx=self.scale_factor, fy=self.scale_factor)
        return new_image

    def get_parameters(self):
        return ["scale", self.scale_factor]
