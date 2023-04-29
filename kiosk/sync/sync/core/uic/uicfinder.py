from uic.uictree import UICTree, compare_selectors, UICError
from dicttools import dict_merge


class UICFinder:
    def __init__(self, tree: UICTree):
        self._tree = tree
        self._ft = tree.flatten(only_with_payload=True, include_payload=True)

    @staticmethod
    def make_permutations(selectors: list[list[int]], full_range: list[int]):
        permutations = []
        for s in selectors:
            idx = full_range.index(s[-1])
            for i in range(idx + 1, len(full_range)):
                permutations.append([*s, full_range[i]])
        return permutations

    def _get_ui_definition_from_selector(self, ui_selector: list[int]) -> dict:
        """
        returns the class definition for the selector
        :param ui_selector: a tokenized selector
        """

        result = dict()

        def starts_with(long_selector: [int], small_selector: [int]):
            if len(long_selector) < len(small_selector):
                return False
            return long_selector[:len(small_selector)] == small_selector

        def __get_ui_definition_from_selector(permutations: [[int]]):
            if not permutations:
                return

            ft_idx = 0
            next_permutations = []
            for idx, sel in enumerate(permutations):
                while ft_idx < len(self._ft):
                    tree_node = self._ft[ft_idx][0]
                    c_rc = compare_selectors(sel, tree_node)
                    if c_rc == 0:
                        dict_merge(result, self._ft[ft_idx][1])
                        ft_idx += 1
                        next_permutations.append(sel)
                        break
                    if c_rc > 0:
                        ft_idx += 1
                        continue
                    if starts_with(tree_node, sel):
                        next_permutations.append(sel)
                    break
            __get_ui_definition_from_selector(self.make_permutations(next_permutations, ui_selector))

        ui_selector.sort()
        __get_ui_definition_from_selector([[x] for x in ui_selector])
        return result

    def get_ui_definition_from_selector(self, ui_selector: list[str]) -> dict:
        tokenized = []
        for sel in ui_selector:
            try:
                t = self._tree.get_selector_index(sel.lower())
                tokenized.append(t)
            except ValueError:
                pass

        return self._get_ui_definition_from_selector(tokenized)
