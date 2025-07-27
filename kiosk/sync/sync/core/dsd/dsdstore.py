from typing import List


class DSDStore:
    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)

    def get(self, index: List):
        raise NotImplementedError

    def set(self, index: List, value):
        raise NotImplementedError

    def merge(self, index: List, value: dict) -> dict:
        raise NotImplementedError

    def get_keys(self, index: List) -> List:
        raise NotImplementedError

    def delete(self, index: List) -> List:
        raise NotImplementedError

    def clear(self) -> None:
        raise NotImplementedError
    
    def pprint(self, key="", width=200) -> str:
        raise NotImplementedError
