class DSDLoader:
    def __init__(self, base_file=""):
        self.basefile = base_file

    def __call__(self, *args, **kwargs):
        return self.read_dsd_file(*args)

    def read_dsd_file(self, file_path_and_name=""):
        raise NotImplementedError

    def read_view_file(self, file_path_and_name=""):
        raise NotImplementedError

