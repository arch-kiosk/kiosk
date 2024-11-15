class DSDError(Exception):
    pass


class DSDWrongVersionError(DSDError):
    pass


class DSDInstructionSyntaxError(DSDError):
    pass


class DSDFileError(DSDError):
    pass


class DSDUnknownInstruction(DSDError):
    pass


class DSDFeatureNotSupported(DSDError):
    pass


class InstructionRequiredError(Exception):
    pass


class DSDDataTypeError(Exception):
    pass


class DSDTableDropped(Exception):
    pass


class DSDSemanticError(Exception):
    pass


class DSDJoinError(Exception):
    pass


class DSDInstructionValueError(Exception):
    pass


class DSDStructuralIssue(Exception):
    pass
