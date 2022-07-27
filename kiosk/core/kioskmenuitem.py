import logging


class KioskMenuItem():
    def __init__(self, name, onclick, endpoint, menu_cfg={}, is_active=None, parent_menu=None, order=""):
        self.name = name
        self.onclick = onclick
        self.endpoint = endpoint
        self.allow_in_all_plugins = True
        self.plugin_exceptions = []
        self._is_active = is_active
        self._parent_menu = parent_menu
        self.order = str(order) if order else name
        try:
            if menu_cfg:
                self.read_menu_config(menu_cfg)
        except Exception as e:
            logging.error("Exception in KioskMenuItem.__init__ for menu {}".format(name) + repr(e))

    def read_menu_config(self, cfg):
        if self.name in cfg:
            self.plugin_exceptions = []
            menu_options = cfg[self.name]
            for m in menu_options:
                m = m.strip()
                if m[:1] == "-":
                    self.allow_in_all_plugins = True
                    self.plugin_exceptions.append(m[1:])
                else:
                    self.allow_in_all_plugins = False
                    if m[:1] == "+":
                        self.plugin_exceptions.append(m[1:])
                    else:
                        self.plugin_exceptions.append(m)

    def is_active(self):
        if self._is_active:
            return self._is_active()
        else:
            return True

    def get_parent_menu_name(self):
        return self._parent_menu
