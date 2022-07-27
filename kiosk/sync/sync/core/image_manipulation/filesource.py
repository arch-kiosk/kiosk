from typing import Generator


class FileSource:
    """ just an interface for classes that return a group of QRCodeFile objects """

    def next_file(self) -> Generator[str, None, None]:
        """
        a generator method that needs to be implemented.
        """
        raise NotImplementedError
