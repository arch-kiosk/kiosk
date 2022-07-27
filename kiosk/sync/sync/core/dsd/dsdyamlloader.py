import yaml
from dsd.dsdloader import DSDLoader


class DSDYamlLoader(DSDLoader):
    def read_yaml_file(self, file_path_and_name=""):
        if not file_path_and_name:
            file_path_and_name = self.basefile

        dsd = {}
        with open(file_path_and_name, "r", encoding='utf8') as ymlfile:
            yml = yaml.load(ymlfile, Loader=yaml.FullLoader)

        return yml

    def read_dsd_file(self, file_path_and_name=""):
        return self.read_yaml_file(file_path_and_name)

    def read_view_file(self, file_path_and_name=""):
        return self.read_yaml_file(file_path_and_name)
