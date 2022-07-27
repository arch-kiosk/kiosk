from image_manipulation.cv2manipulationcomposition import CV2ManipulationComposition
from image_manipulation.cv2adaptivethresholdmanipulation import CV2AdaptiveThresholdManipulation
from image_manipulation.cv2scalemanipulation import CV2ScaleManipulation
from image_manipulation.cv2blurmanipulation import CV2BlurManipulation


class CV2QrCodeThresholding(CV2ManipulationComposition):

    def __init__(self, name: str, data: dict, debug=False):
        """
        Creates a CV2ManipulationComposition with the manipulations scale, blur and adaptivethresholding.
        :param data: a dict with one or all of these keys/value pairs:
                "scale_factor": float between 0 and 2
                "block_size": block size for the AdaptiveThreshold manipulation. An Integer, must be odd. Required.
                "blur": blur factor. An Integer > 0. 0 means not blur at all, in which case the key is not needed.
        """
        super().__init__(name, debug)
        self._init_from_dict(data)

    def _init_from_dict(self, data: dict):

        if "scale_factor" in data and data["scale_factor"] > 0.0 and data["scale_factor"] != 1.0:
            self.append_manipulation(CV2ScaleManipulation(data["scale_factor"]))

        if "blur" in data and data["blur"] > 0:
            self.append_manipulation(CV2BlurManipulation(data["blur"]))

        if "block_size" in data and data["block_size"] > 0:
            self.append_manipulation(CV2AdaptiveThresholdManipulation(data["block_size"], c=1))
        else:
            raise Exception("block size required but not given.")








