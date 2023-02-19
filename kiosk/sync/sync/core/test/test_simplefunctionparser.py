from simplefunctionparser import SimpleFunctionParser


class TestSimpleFunctionParser:

    def test_init(self):
        parser = SimpleFunctionParser()
        parser.parse("nonsense")
        assert not parser.ok
        parser.parse('nonsense("nearly ok"')
        assert not parser.ok

    def test_find_function_call(self):
        parser = SimpleFunctionParser()
        parser.parse("datatype(\"something\")")
        assert parser.instruction == "datatype"

    def test_find_parameter(self):
        parser = SimpleFunctionParser()
        parser.parse("datatype(\"VARCHAR\")")
        assert parser.ok
        assert parser.instruction == "datatype"
        assert len(parser.parameters) == 1

        parser.parse("settype(\"VARCHAR\", 10)")
        assert parser.ok
        assert parser.instruction == "settype"
        assert len(parser.parameters) == 2
        assert "VARCHAR" in parser.parameters
        assert '10' in parser.parameters

    def test_no_parameters(self):
        parser = SimpleFunctionParser()
        parser.parse("noparamfunc()")
        assert parser.ok
        assert parser.instruction == "noparamfunc"
        assert len(parser.parameters) == 0

    def test_empty_parameter(self):
        parser = SimpleFunctionParser()
        parser.parse("noparamfunc(\"\")")
        assert parser.ok
        assert parser.instruction == "noparamfunc"
        assert len(parser.parameters) == 1

    def test_empty_parameter_in_the_middle(self):
        parser = SimpleFunctionParser()
        parser.parse("noparamfunc(first,\"\",\"third\")")
        assert parser.ok
        assert parser.instruction == "noparamfunc"
        assert len(parser.parameters) == 3

        parser = SimpleFunctionParser()
        parser.parse("noparamfunc(first,'',\"third\")")
        assert parser.ok
        assert parser.instruction == "noparamfunc"
        assert len(parser.parameters) == 3

        parser = SimpleFunctionParser()
        parser.parse("noparamfunc(\"first\",,\"third\")")
        assert parser.ok
        assert parser.instruction == "noparamfunc"
        assert len(parser.parameters) == 3

    def test_strange_empty_parametera(self):
        parser = SimpleFunctionParser()
        parser.parse("func(,,,)")
        assert parser.ok
        assert parser.instruction == "func"
        assert parser.parameters == ['', '', '', '']

        parser.parse("func(,a,b,)")
        assert parser.ok
        assert parser.instruction == "func"
        assert parser.parameters == ['', 'a', 'b', '']

    def test_empty_parameter_at_the_end(self):
        parser = SimpleFunctionParser()
        parser.parse("noparamfunc(first,second,)")
        assert parser.ok
        assert parser.instruction == "noparamfunc"
        assert len(parser.parameters) == 3

        parser.parse("noparamfunc(first,second,\"\")")
        assert parser.ok
        assert parser.instruction == "noparamfunc"
        assert len(parser.parameters) == 3

        parser.parse("noparamfunc(first,second,'')")
        assert parser.ok
        assert parser.instruction == "noparamfunc"
        assert len(parser.parameters) == 3

    def test_test_case_1(self):
        parser = SimpleFunctionParser()
        parser.parse("equals(modified_by, \"Urap's iPad\")")
        print(parser.err)
        assert parser.ok
        assert parser.instruction == "equals"
        assert parser.parameters[0] == "modified_by"
        assert parser.parameters[1] == "Urap's iPad"

    def test_null(self):
        parser = SimpleFunctionParser()
        parser.parse("default(something)")
        assert parser.ok
        assert parser.instruction == "default"
        assert parser.parameters[0] == "something"

        parser.parse("default('something')")
        assert parser.ok
        assert parser.instruction == "default"
        assert parser.parameters[0] == "something"

        parser.parse("default(null)")
        assert parser.ok
        assert parser.instruction == "default"
        assert parser.parameters[0] == "null"

        parser.parse("default('null')")
        assert parser.ok
        assert parser.instruction == "default"
        assert parser.parameters[0] == "'null'"

        parser.parse("default(\"null\")")
        assert parser.ok
        assert parser.instruction == "default"
        assert parser.parameters[0] == "'null'"

        parser.parse("default(\"'null'\")")
        assert parser.ok
        assert parser.instruction == "default"
        assert parser.parameters[0] == "'null'"

        parser.parse("default('\"null\"')")
        assert parser.ok
        assert parser.instruction == "default"
        assert parser.parameters[0] == '"null"'

    def test_internal_brackets(self):
        parser = SimpleFunctionParser()
        parser.parse("func('something(that has brackets)', 'More(brackets)')")
        assert parser.ok
        assert parser.parameters[0] == "something(that has brackets)"
        assert parser.parameters[1] == "More(brackets)"

        parser.parse("func(something(that has brackets), More(brackets))")
        assert parser.ok
        assert parser.parameters[0] == "something(that has brackets)"
        assert parser.parameters[1] == "More(brackets)"

    def test_get_instruction_name_only(self):
        parser = SimpleFunctionParser()
        assert parser.get_instruction_name_only("no instruction here") == ""
        assert parser.get_instruction_name_only("instruction()") == "instruction"
        assert parser.get_instruction_name_only("instruction(,,,)") == "instruction"
        assert parser.get_instruction_name_only("instruction(a,b,c,d)") == "instruction"
