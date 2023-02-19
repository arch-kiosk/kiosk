import logging
import re


class SimpleFunctionParser:
    src_regex_function = r"""^\s*(?P<instruction>[a-zA-z0-9]+)\((?P<params>.*?)\)\s*$"""
    # src_regex_params = r"""((\s*\"(?P<param_quote>.*?)\"\s*)|(\s*'(?P<param_singlequote>.*?)'\s*)|(\s*(?P<param_noquote>[^\s|^,]+?)))(,|$)"""
    src_regex_params = r"""((\s*\"(?P<param_quote>.*?)\"\s*)|(\s*'(?P<param_singlequote>.*?)'\s*)|(\s*(?P<param_noquote>[^,]*)))(?P<end>,|$)"""

    def __init__(self):
        self.regex_function = re.compile(self.src_regex_function)
        self.regex_params = re.compile(self.src_regex_params)
        self.ok = False
        self.parameters = []
        self.instruction = ""
        self.err = ""

    def get_error(self) -> str:
        """
        returns the last error message. Does not check if the last parsing did in fact succeed.
        In that case "unknown error" would be returned.
        :return: the last error message or "unknown error" if there was none reported.
        """
        return self.err if self.err else "unknown error"

    def get_instruction_name_only(self, command: str):
        """
        returns only the name of the instruction
        :param command:
        :return: name of the instruction or "" if the command is not a valid instruction
        """
        result = self.regex_function.match(command)
        if result and len(result.groups()) == 2:
            return result.group('instruction')
        else:
            return ""

    def parse(self, command: str) -> None:
        self.ok = False
        self.instruction = ""
        self.parameters = []
        self.err = ""

        result = self.regex_function.match(command)
        if result and len(result.groups()) == 2:
            self.instruction = result.group('instruction')
            _params = result.group('params')
            if not str(_params).strip():
                self.ok = True
            else:
                self.ok = True if self.regex_params.search(_params) else False
                if self.ok:
                    match_iter = self.regex_params.finditer(_params)
                    # match = next(match_iter) #popping the first elemt - it's useless.
                    for match in match_iter:
                        for group in ["param_quote", "param_singlequote", "param_noquote"]:
                            try:
                                # according to the python docs this should not be necessary but it is:
                                # no IndexError thrown
                                if match.group(group) is not None:
                                    value = match.group(group)
                                    if group != "param_noquote" and value.lower() == 'null':
                                        value = f"'{value}'"
                                    self.parameters.append(value)
                                    break
                            except IndexError as e:
                                pass
                        if not match.group("end"):
                            break
                else:
                    self.err = "syntax error"
                    logging.debug(f"SimpleFunctionParser.parse: Syntax error in params of command {command}.")
        else:
            self.err = "too many syntactical groups"
            # logging.debug(f"SimpleFunctionParser.parse: No or too many syntactical groups in {command}.")
