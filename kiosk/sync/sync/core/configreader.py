import logging

import kioskstdlib
from yamlconfigreader import YAMLConfigReader
#from jsonconfigreader import JSONConfigReader


class ConfigReader:
    reader_mapping = {"yml": YAMLConfigReader,
                      "yaml": YAMLConfigReader
                      }

    @classmethod
    def read_file(cls, file_path_and_name):

        ext = kioskstdlib.get_file_extension(file_path_and_name).lower()
        if ext not in cls.reader_mapping:
            raise Exception(f"{cls.__name__}.read_file: {file_path_and_name} has unknown file type.")

        reader = cls.reader_mapping[ext](file_path_and_name)
        return reader.read_file(file_path_and_name)
