from simplefunctionparser import SimpleFunctionParser
from simplegrammartree import SimpleGrammarTree, and_or_node
import pytest


class TestSimpleGrammarTree:

    @staticmethod
    def leaf(value: str):
        return value

    @staticmethod
    def node(key: str, *args):
        s = ""
        _op = ""
        for leaf in args:
            s = s + _op + leaf
            _op = f" {key} "

        if len(args) > 1:
            return f"({s})"
        else:
            return s

    def test_init(self):

        tree = SimpleGrammarTree(self.leaf, self.node)
        tree.set_tree({})
        assert not tree.run()

    def test_only_one_leaf_on_root(self):

        # test the special one-liner syntax
        tree = SimpleGrammarTree(self.leaf, self.node)
        tree.set_tree({"?": "value1"})
        assert tree.run() == "value1"

        tree = SimpleGrammarTree(self.leaf, self.node)
        tree.set_tree({"key1": "value1"})
        with pytest.raises(KeyError):
            assert tree.run() == "value1"

        tree = SimpleGrammarTree(self.leaf, self.node)
        tree.set_tree({"key1": "value1",
                       "key2": "value2"})
        with pytest.raises(KeyError):
            assert tree.run() == "value1"

    def test_one_node(self):
        tree = SimpleGrammarTree(self.leaf, self.node)
        tree.set_tree({
            "AND": {
                "key1": "value1"}
        })
        with pytest.raises(ValueError):
            assert tree.run() == "value1"

        tree.set_tree({
            "AND": [
                "value1"]
        })
        assert tree.run() == "value1"

        tree = SimpleGrammarTree(self.leaf, self.node)
        tree.set_tree({
            "AND": [
                "value1",
                "value2"]
        })
        assert tree.run() == "(value1 AND value2)"

        tree = SimpleGrammarTree(self.leaf, self.node)
        tree.set_tree({
            "AND": [
                "value1",
                "value2",
                "value3"]
        })
        assert tree.run() == "(value1 AND value2 AND value3)"

    def test_two_nodes(self):
        tree = SimpleGrammarTree(self.leaf, self.node)
        tree.set_tree({
            "AND": [
                "value1",
                {
                    "OR": [
                        "or_value1"
                    ]
                }
            ]
        })
        assert tree.run() == "(value1 AND or_value1)"

        tree = SimpleGrammarTree(self.leaf, self.node)
        tree.set_tree({
            "AND": [
                "value1",
                {
                    "OR": [
                        "or_value1",
                        "or_value2"]
                }]
        }
        )
        assert tree.run() == "(value1 AND (or_value1 OR or_value2))"

        tree = SimpleGrammarTree(self.leaf, self.node)
        tree.set_tree({
            "AND": [
                {
                    "OR": [
                        "or_value1",
                        "or_value2"]
                },
                "and_value1",
                "and_value2"]
        })
        assert tree.run() == "((or_value1 OR or_value2) AND and_value1 AND and_value2)"

        tree = SimpleGrammarTree(self.leaf, self.node)
        tree.set_tree({
            "AND": [
                {
                    "OR": [
                        "or_value1",
                        "or_value2"]
                },
                {
                    "AND": [
                        "and_value1",
                        "and_value2", ]

                }]
        })
        assert tree.run() == "((or_value1 OR or_value2) AND (and_value1 AND and_value2))"

    def test_deep_tree(self):
        tree = SimpleGrammarTree(self.leaf, self.node)
        tree.set_tree({
            "AND": [
                {
                    "AND": [
                        {
                            "OR": [
                                {
                                    "AND": [
                                        {
                                            "OR": [
                                                "single_value",
                                                "another_value"]
                                        }]
                                },
                                "yet_another_value"]
                        },
                        "and_value_1",
                        "and_value_2",
                    ]
                }]
        })
        assert tree.run() == "(((single_value OR another_value) OR yet_another_value) AND and_value_1 AND and_value_2)"

        tree.set_tree({
            "OR": [
                {
                    "AND": [
                            "condition1",
                            "condition2"]
                },
                {
                    "AND": [
                        "condition3",
                        "condition4"]
                }

            ]
        })
        assert tree.run() == "((condition1 AND condition2) OR (condition3 AND condition4))"

    def test_binary_arithmetics(self):
        def leaf(value):
            return value

        def node(key, *values):
            if len(values) == 1:
                return values[0]

            if key == "+":
                return values[0] + values[1]
            if key == "-":
                return values[0] - values[1]
            if key == "*":
                return values[0] * values[1]

        tree = SimpleGrammarTree(leaf, node)
        tree.set_tree({
            "+": [
                1,
                2
            ]
        })
        tree.run()
        assert tree.result == 3

        tree.set_tree({
            "*": [
                2,
                {
                    "+": [1, 2]
                }
            ]
        })
        tree.run()
        assert tree.result == 6

    def test_and_or_node(self):
        tree = SimpleGrammarTree(self.leaf, and_or_node)

        tree.set_tree({
            "AND": [
                {
                    "AND": [
                        {
                            "OR": [
                                {
                                    "AND": [
                                        {
                                            "OR": [
                                                "single_value",
                                                "another_value"]
                                        }]
                                },
                                "yet_another_value"]
                        },
                        "and_value_1",
                        "and_value_2",
                    ]
                }]
        })
        assert tree.run() == "(((single_value OR another_value) OR yet_another_value) AND and_value_1 AND and_value_2)"
