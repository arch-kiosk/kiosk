import logging
import kioskglobals
import os
from flask import url_for


class ScriptManager:
    def __init__(self):
        self.scripts = {}
        self.clear()

    def clear(self):
        self.scripts = {}

    def add_script(self, identifier, script_attributes):
        if len(script_attributes) == 3:
            # compatibility with plugins in kiosk < 0.26.2
            script_attributes.append(lambda: True)
        self.scripts[identifier] = script_attributes

    def get_synchronous_scripts_tags(self):
        scripttags = ""

        for s in self.scripts:
            script_elements = self.scripts[s]
            try:
                if script_elements[3]():
                    if script_elements[2] == "sync":
                        scripttags += '<script type="text/javascript" src="{}"></script>'.format(
                            self.get_url_for_script(script_elements[0], script_elements[1]))
            except Exception as e:
                logging.warning(
                    "ScriptManager.get_synchronous_scripts_tags: script {} caused exception ".format(s) + repr(e))

        #  publish_script += "setTimeout(()=>{alert('publish script');},100);"
        return scripttags

    def get_asynchronous_scripts_script(self):
        script = ''

        for s in self.scripts:
            script_elements = self.scripts[s]
            try:
                if script_elements[3]():
                    if len(script_elements) == 2 or script_elements[2] == "async":
                        script += "$.getScript('{}');".format(
                            self.get_url_for_script(script_elements[0], script_elements[1]))
            except Exception as e:
                logging.warning(
                    "ScriptManager.get_asynchronous_scripts_tags: script {} caused exception ".format(s) + repr(e))

        if script:
            script = '<script type="text/javascript">' + script + "</script>"

        return script

    def get_url_for_script(self, variable, file_path):
        if variable:
            if variable in kioskglobals.cfg.kiosk:
                script_path = os.path.join(kioskglobals.cfg.kiosk[variable], file_path)
                return script_path

        script_path = url_for(variable, filename=file_path)
        return script_path
