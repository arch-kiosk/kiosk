import kioskstdlib


class QualityControlRule:
    def __init__(self, **kwargs):
        self.id = kioskstdlib.try_get_dict_entry(kwargs, "id", "", True)
        self.trigger = kioskstdlib.try_get_dict_entry(kwargs, "trigger", "", True)
        self.type = kioskstdlib.try_get_dict_entry(kwargs, "type", "", True)
        self.type_param = kioskstdlib.try_get_dict_entry(kwargs, "type_param", "", True)
        self.hosts = kioskstdlib.try_get_dict_entry(kwargs, "hosts", "", True)
