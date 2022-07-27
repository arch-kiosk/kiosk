import os
from typing import Generator

from image_manipulation.filesource import FileSource


class DirectoryFileSource(FileSource):

    def __init__(self, path_name: str):
        self.path_name = path_name

    def next_file(self) -> Generator[str, None, None]:
        for filename in os.listdir(self.path_name):
            path_and_filename = os.path.join(self.path_name, filename)
            if os.path.isfile(path_and_filename):
                yield str(path_and_filename)
