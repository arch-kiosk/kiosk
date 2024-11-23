import logging
from flask import url_for


class UrlForPublisher:
    def __init__(self):
        self.routes = None
        self.clear()

    def clear(self):
        self.routes = {}

    def add_route(self, identifier, route=""):
        self.routes[identifier] = route

    def get_script(self):
        publish_script = "<script>"
        publish_script += "$(() => {"
        publish_script += "clearRoutes();"

        for r in self.routes:
            try:
                url : str = self.routes[r]
                if url == "":
                    if r.endswith(".static"):
                        # logging.debug(f"trying {r}")
                        url = url_for(r, filename='.')
                        url = url[:-2]
                    else:
                        url = url_for(r)
                publish_script += "addRoute('{}','{}');\n".format(r, url)
            except Exception as e:
                logging.warning("UrlForPublisher: route {} caused exception ".format(r) + repr(e))

        #  publish_script += "setTimeout(()=>{alert('publish script');},100);"
        publish_script += "})</script>"
        return publish_script
