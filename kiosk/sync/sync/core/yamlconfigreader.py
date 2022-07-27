import yaml
import logging


class YAMLConfigReader:
    def __init__(self, basefile):
        self.basefile = basefile

    def __call__(self, *args, **kwargs):
        return self.read_file(*args)

    def read_file(self, file_path_and_name):
        if not file_path_and_name:
            file_path_and_name = self.basefile

        cfg = {}
        try:
            with open(file_path_and_name, "r", encoding='utf8') as ymlfile:
                yaml_content = ymlfile.read()
        except BaseException as e:
            logging.error(f"Exception in YAMLConfigReader when reading file {file_path_and_name}: repr(e)")
            raise e

        try:
            cfg = yaml.load(yaml_content, Loader=yaml.FullLoader)
        except yaml.YAMLError as e:
            logging.error(f"Exception in YAMLConfigReader when parsing {file_path_and_name}: repr(e)")
            try:
                logging.error(e.problem_mark)
            except:
                pass
            raise e
        return cfg
