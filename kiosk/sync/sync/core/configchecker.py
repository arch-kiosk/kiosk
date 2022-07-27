from config import Config


class ConfigChecker():
    '''
        checks a configuration file by calling formerly registered checker functions on it.

        Checker functions get the configuration as a parameter and return a tuple or an array of tuples
        of the kind (return_code, msg: str)

        The return code should be one of the three constants
            ConfigChecker.CONFIG_OK,ConfigChecker.CONFIG_ERROR,ConfigChecker.CONFIG_WARNING

        a checker function of the type function(Config) is registered by using register_config_checker.

    '''
    CONFIG_OK = True
    CONFIG_ERROR = False
    CONFIG_WARNING = 2

    def __init__(self, config: Config):
        self._config_checkers = []
        self.config: Config = config

    def check_config(self):
        '''
            returns true only if none of the checker-functions returns an error. A warning is ok.
            :return: True or False
        '''
        rc = True
        for check_function in self._config_checkers:
            responses = check_function(self.config)
            if not responses:
                rc = False
            elif isinstance(responses, tuple):
                rc = rc and responses[0]
            else:
                for r in responses:
                    rc = rc and r[0]

        return rc

    def register_config_checker(self, config_checker):
        '''
            registers a callable config checker that takes a Config object and returns ConfigChecker.CONFIG_xxx
        '''

        if callable(config_checker):
            self._config_checkers.append(config_checker)
        else:
            raise TypeError("config_checker must be callable.")

    def get_report(self, level=CONFIG_OK):
        '''
            returns an array of strings with those messages that are as severe or worse than the level
            level can be ConfigChecker.CONFIG_OK, ... CONFIG_WARNING or ... CONGIG_ERROR
        '''

        def add_response(r):
            if not r[0] or (r[0] == 2 and level == self.CONFIG_WARNING) or (level == self.CONFIG_OK):
                s = ""
                if not r[0]:
                    s = "ERROR: {}".format(r[1])
                elif r[0] == self.CONFIG_WARNING:
                    s = "WARNING: {}".format(r[1])
                elif r[0] == self.CONFIG_WARNING:
                    s = "OK: {}".format(r[1])
                rc.append(s)

        rc = []
        for check_function in self._config_checkers:
            responses = check_function(self.config)
            if responses:
                if isinstance(responses, tuple):
                    add_response(responses)
                else:
                    for r in responses:
                        add_response(r)
        return rc
