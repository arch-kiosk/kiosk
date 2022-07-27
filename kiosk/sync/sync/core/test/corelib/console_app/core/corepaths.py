import sys
import os

#add paths (packages) here so that importing modules from that path (package)
# can be done by just using the name without . or .. or such atrocities
# use only for really globally assessed packages, like the core itself.

CORE_PATHS = ["../core"]

#not DRY. The same method can be found in ../core/pluginmanager, but that is something we are about to reach by
#setting the core path in the first place. Henn and Egg problem I can't solve, currently
def register_core_path(paths):
    absolute_paths = [os.path.abspath(p) for p in paths]
    for p in absolute_paths:
        if p not in sys.path:
            sys.path.append(p)


register_core_path(CORE_PATHS)
