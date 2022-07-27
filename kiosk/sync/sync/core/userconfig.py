from generalstore.generalstore import GeneralStore
from generalstore.generalstorekeys import gs_key_user_config


class UserConfig:
    def __init__(self, gs: GeneralStore, user_id: str, project_id: str = ""):
        self.gs = gs
        self.user_id = user_id
        self.project_id = project_id

    def _make_key(self, topic):
        if self.project_id:
            return gs_key_user_config + "#" + self.user_id + "#" + self.project_id + "#" + topic
        else:
            return gs_key_user_config + "#" + self.user_id + "#" + topic

    def init_topic(self, topic: str, default_config: dict, force_init: bool = False) -> dict:
        """
        initializes the user specific configuration if the topic does not already exist or
        force_init is true.
        :param topic: the configuration topic (usually something like the name of the plugin or so)
        :param default_config: a dictionary that will be stored under the topic for the user if the
                               topic does not exist.
        :param force_init:     if True the default_config will override the current user config if necessary
        :returns: the user's config dict
        """

        topic_key = self._make_key(topic)
        if not force_init:
            try:
                cfg = self.gs.get_dict(topic_key)
                if cfg:
                    return cfg
            except KeyError as e:
                pass

        self.gs.put_dict(topic_key, [], default_config)
        return self.gs.get_dict(topic_key)

    def get_config(self, topic) -> dict:
        """
        return'S the user's configuration for the topic if there is one.
        :param topic:
        :returns: the config dictionary or an empty dict
        """
        topic_key = self._make_key(topic)
        try:
            return self.gs.get_dict(topic_key)
        except KeyError as e:
            return {}

