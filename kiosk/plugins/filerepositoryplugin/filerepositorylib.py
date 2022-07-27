import copy


#
# todo: refactor / redesign
# Plugin-specific methods
#
def get_std_file_images(plugin):
    cfg = plugin.plugin_config("file_icons")
    if cfg:
        return cfg
    else:
        return {}


def get_file_description_priorities(plugin, priority_set=""):
    priority_sets = plugin.plugin_config("file_descriptions")
    if priority_set and priority_set in priority_sets:
        return copy.deepcopy(priority_sets[priority_set])
    else:
        try:
            return copy.deepcopy(priority_sets[next(iter(priority_sets))])
        except Exception as e:
            print("Exception: >>>>>>> " + repr(e))
            print(priority_sets)
