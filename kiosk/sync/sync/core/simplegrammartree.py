import logging
import copy
import pprint

class GrammarError(Exception):
    pass

def and_or_node(key: str, *args):
    if key.lower() in ["and", "or"]:
        s = ""
        _op = ""
        for leaf in args:
            s = s + _op + leaf
            _op = f" {key} "

        if len(args) > 1:
            return f"({s})"
        else:
            return s
    else:
        raise KeyError(f"simplegrammartree.and_or_node: '{key}' is not a correct node value. Use only 'AND' or 'OR'")


class SimpleGrammarTree:
    MAX_TREE_DEPTH = 10

    def __init__(self, leaf_callback, node_callback):
        self.leaf_callback = leaf_callback
        self.node_callback = node_callback
        self.result = None
        if not self.leaf_callback or not self.node_callback:
            raise ValueError("SimpleGrammarTree.__init__: both a leaf_callback and a node_callback have to be given.")
        self._in_tree = {}
        self._out_tree = {}

    def set_tree(self, tree: dict):
        self._in_tree = tree
        self.result = None

    def run(self):
        def _run(tree_segment: dict, level=0):
            if level > self.MAX_TREE_DEPTH:
                raise RecursionError("SimpleGrammarTree.run: too many levels of recursion.")

            keys = list(tree_segment.keys())
            if len(keys) > 1:
                raise KeyError(f"Only one key is allowed where {pprint.pformat(tree_segment.keys())} is given.")
            if len(keys) == 0:
                return ""

            key = keys[0]
            conditions = tree_segment[key]

            if isinstance(conditions, list):
                for idx in range(0, len(conditions)):
                    if isinstance(conditions[idx], dict):
                        conditions[idx] = _run(conditions[idx], level + 1)
                    else:
                        conditions[idx] = self.leaf_callback(conditions[idx])
                return self.node_callback(key, *conditions)

            else:
                if level == 0 and isinstance(conditions, str):
                    if key == '?':
                        return self.leaf_callback(conditions)
                    else:
                        raise KeyError(f"A one-liner has to start with the key ?. {pprint.pformat(tree_segment)} does not.")
                else:
                    raise ValueError(f"They value for key {key} must be a list of conditions but is not.")

        #
        # main run
        #

        self._out_tree = copy.deepcopy(self._in_tree)
        self.result = {}
        self.result = _run(self._out_tree)
        return self.result

