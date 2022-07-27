import cv2
from image_manipulation.imagemanipulation import ImageManipulation


class CV2AdaptiveThresholdManipulation(ImageManipulation):
    def __init__(self, block_size: int, c: int):
        self.block_size = block_size
        self.c = c

    def execute_manipulation(self, image):
        new_image = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, \
                                          cv2.THRESH_BINARY, self.block_size, self.c)
        return new_image

    def get_parameters(self):
        return ["block_size", self.block_size]
