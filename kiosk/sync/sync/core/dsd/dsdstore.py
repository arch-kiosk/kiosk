
class DSDStore:
    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)

    def get(self, index: []):
        raise NotImplementedError

    def set(self, index: [], value):
        raise NotImplementedError

    def merge(self, index: [], value: dict) -> dict:
        raise NotImplementedError

    def get_keys(self, index: []) -> []:
        raise NotImplementedError

    def delete(self, index: []) -> []:
        raise NotImplementedError

    def clear(self) -> None:
        raise NotImplementedError
    
    def pprint(self, key="", width=200) -> str:
        raise NotImplementedError
