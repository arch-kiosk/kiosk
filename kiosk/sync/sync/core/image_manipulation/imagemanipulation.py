class ImageManipulation:
    """ interface: All Image Manipulation classes need to offer this interface """
    def execute_manipulation(self, image):
        raise NotImplementedError

    def get_parameters(self):
        raise NotImplementedError

