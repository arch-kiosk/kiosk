import re

from dicttools import dict_merge


def compare_selectors(left: [int], right: [int]):
    """
    comapres two integer arrays
    :param left: int[]
    :param right: int[]
    :return: -1 if the left one is smaller, 1 if it is bigger, 0 if they are identical
    """
    for idx, v in enumerate(left):
        if idx == len(right):
            return 1
        if v < right[idx]:
            return -1
        if v > right[idx]:
            return 1
    if len(right) > len(left):
        return -1

    return 0


class UICError(IOError):
    pass

class UICTreeNode:
    def __init__(self, selector, data):
        self.data: dict = data
        self.selector: [int] = selector
        self.children: [UICTreeNode] = []


class UICTree:
    selectors: [str]
    src_regex_selectors = r"""\s*(?P<selector>.+?)((?P<operator>\|\||\&\&)|$)"""

    def __init__(self):
        self.selectors = []
        self.regex_selectors = re.compile(self.src_regex_selectors)
        self.root = UICTreeNode([], {})

    @staticmethod
    def _unmask_selector(selector):
        return selector.replace("&\\&", "&&").replace("|\\|", "||")

    def add_selector(self, selector: str):
        self.selectors.append(self._unmask_selector(selector))
        return len(self.selectors) - 1

    def get_selector_index(self, selector: str):
        """
        returns the index for a selector. Note that the caller is responsible for lower-casing the selector.

        :param selector: lower case(!) string selector
        :return:
        """
        return self.selectors.index(self._unmask_selector(selector))

    def to_dict(self, include_data=False):
        def _to_dict(node: UICTreeNode):
            d = {"__selector": node.selector, "children": []}
            if include_data:
                d["_data"] = node.data

            d["children"] = [_to_dict(child) for child in node.children]
            return d

        return _to_dict(self.root)

    def flatten(self, only_with_payload=True, include_payload=False):
        r = []

        def _flatten(node: UICTreeNode):
            if node.selector and (not only_with_payload or node.data):
                if include_payload:
                    r.append((node.selector, node.data))
                else:
                    r.append(node.selector)
            for child in node.children:
                _flatten(child)

        _flatten(self.root)
        return r

    def _insert_child(self, node: UICTreeNode, new_node: UICTreeNode):
        for idx, child in enumerate(node.children):
            if compare_selectors(new_node.selector, child.selector) < 1:
                node.children.insert(idx, new_node)
                return
        node.children.append(new_node)

    def add_data_chunk(self, tokenized_selector: [int], data: dict):

        def _add(depth: int, node: UICTreeNode):
            selected_child = None
            current_selector = tokenized_selector[:depth]
            for child in node.children:
                if child.selector == current_selector:
                    selected_child = child

            if not selected_child:
                selected_child = UICTreeNode(list(current_selector), {})
                self._insert_child(node, selected_child)

            if depth == len(tokenized_selector):
                dict_merge(selected_child.data, data)
                return

            _add(depth + 1, selected_child)

        _add(depth=1, node=self.root)

    def parse_selector(self, selectors: str) -> [[int]]:
        """
        splits the selectors up and translates them into a list of ints, sorts that list
        and stores it with the data chunk in the tree.
        && (AND) combinations are stored together,
        || (OR) combinations are split up
        && can be masked with &\&, || &|&


        :param selectors: a string with selectors
        :result: None
        """

        result: [[int]] = []

        def _push_and_tokens():
            and_tokens.sort()
            result.append(and_tokens)

        open_operator = False
        match_iter = self.regex_selectors.finditer(selectors)
        and_tokens: [int] = []
        for match in match_iter:
            if match.group("selector"):
                selector = match.group("selector").strip().lower()
                if selector in ["&&", "||"]:
                    raise UICError(f"unexpected operator")

                try:
                    token = self.get_selector_index(selector)
                except ValueError:
                    token = self.add_selector(selector)

                open_operator = False
                if match.group("operator"):
                    operator = match.group("operator").strip().lower()
                    if operator:
                        if operator == "&&":
                            and_tokens.append(token)
                        else:
                            and_tokens.append(token)
                            if operator == "||":
                                _push_and_tokens()
                                and_tokens = []
                            else:
                                raise UICError(f"unknown operator {operator}")

                        open_operator = True
                    else:
                        and_tokens.append(token)
                else:
                    and_tokens.append(token)

        if open_operator:
            raise UICError(f"dangling operator")
        if and_tokens:
            _push_and_tokens()

        return result
