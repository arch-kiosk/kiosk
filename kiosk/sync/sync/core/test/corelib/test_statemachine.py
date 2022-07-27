from statemachine import StateMachine, StateMachineException, StateTransition
from functools import reduce
import pytest


class TestEventManager:
    _log = []

    @pytest.fixture(autouse=True)
    def init_test(self):
        self._log = []

    def test_add_state(self):
        state_machine = StateMachine()
        assert not state_machine.get_state()

        state_machine.add_state("State1")
        assert "STATE1" in state_machine.states_and_transitions

        with pytest.raises(StateMachineException) as excinfo:
            state_machine.add_state("State1")
        assert "already" in str(excinfo.value)

        state_machine.add_state("State2")
        assert "STATE1" in state_machine.states_and_transitions
        assert "STATE2" in state_machine.states_and_transitions

    def test_set_initial_state(self):
        state_machine = StateMachine()
        assert not state_machine.get_state()

        with pytest.raises(StateMachineException) as excinfo:
            state_machine.set_initial_state("State1")
        assert "unknown" in str(excinfo.value)

        state_machine.add_state("State1")
        assert "STATE1" in state_machine.states_and_transitions

        state_machine.set_initial_state("State1")
        assert state_machine.get_state() == "STATE1"

        with pytest.raises(StateMachineException) as excinfo:
            state_machine.set_initial_state("State1")
        assert "not None" in str(excinfo.value)

    def test_add_transiton(self):
        state_machine: StateMachine = StateMachine()
        with pytest.raises(StateMachineException) as excinfo:
            state_machine.add_transition("Undefined", StateTransition("save", "Idle"))
        assert "unknown target" in str(excinfo.value)

        state_machine.add_state("Idle")
        with pytest.raises(StateMachineException) as excinfo:
            state_machine.add_transition("Undefined", StateTransition("save", "Idle"))
        assert "unknown origin" in str(excinfo.value)

        state_machine.add_state("Undefined")
        state_machine.add_transition("Undefined", StateTransition("save", "Idle"))
        assert "SAVE" in state_machine.states_and_transitions["UNDEFINED"]

        state_machine.add_state("IN_THE_FIELD")
        with pytest.raises(StateMachineException) as excinfo:
            state_machine.add_transition("Undefined", StateTransition("save", "IN_THE_FIELD"))
        assert "already exists" in str(excinfo.value)

        state_machine.add_transition("Idle", StateTransition("save", "IN_THE_FIELD"))
        assert "SAVE" in state_machine.states_and_transitions["UNDEFINED"]
        assert "SAVE" in state_machine.states_and_transitions["IDLE"]

    def test_get_transition(self):
        state_machine: StateMachine = StateMachine()
        state_machine.add_state("Idle")
        state_machine.add_state("Undefined")
        state_machine.add_state("IN_THE_FIELD")
        state_machine.add_transition("Undefined", StateTransition("save", "Idle"))
        state_machine.add_transition("Idle", StateTransition("save", "IN_THE_FIELD"))
        assert state_machine.get_transition("Undefined", "save").target_state == "IDLE"
        assert state_machine.get_transition("Idle", "save").target_state == "IN_THE_FIELD"

    def test_next_state(self):
        state_machine: StateMachine = StateMachine()
        state_machine.add_state("Idle")
        state_machine.add_state("Undefined")
        state_machine.add_state("Branched")
        state_machine.add_transition("Undefined", StateTransition("save", "Idle"))

        with pytest.raises(StateMachineException) as excinfo:
            assert "IDLE" in state_machine.next_states()
        assert "uninitialized" in str(excinfo.value)

        state_machine.set_initial_state("Undefined")
        assert "IDLE" in state_machine.next_states()
        assert len(state_machine.next_states()) == 1

        state_machine.add_transition("Undefined", StateTransition("skip", "Idle"))
        assert "IDLE" in state_machine.next_states()
        assert len(state_machine.next_states()) == 1

        state_machine.add_transition("Undefined", StateTransition("branch", "Branched"))
        assert "IDLE" in state_machine.next_states()
        assert "BRANCHED" in state_machine.next_states()
        assert len(state_machine.next_states()) == 2

    def test_available_transitions(self):
        state_machine: StateMachine = StateMachine()
        state_machine.add_state("Idle")
        state_machine.add_state("Undefined")
        state_machine.add_state("Branched")

        state_machine.add_transition("Undefined", StateTransition("save", "Idle"))
        with pytest.raises(StateMachineException) as excinfo:
            assert "SAVE" in state_machine.next_states()
        assert "uninitialized" in str(excinfo.value)

        state_machine.set_initial_state("Undefined")
        assert "SAVE" in state_machine.available_transitions()
        assert len(state_machine.available_transitions()) == 1

        state_machine.add_transition("Undefined", StateTransition("skip", "Idle"))
        assert "SAVE" in state_machine.available_transitions()
        assert "SKIP" in state_machine.available_transitions()
        assert len(state_machine.available_transitions()) == 2

        state_machine.add_transition("Undefined", StateTransition("branch", "Branched"))
        assert "SAVE" in state_machine.available_transitions()
        assert "SKIP" in state_machine.available_transitions()
        assert "BRANCH" in state_machine.available_transitions()
        assert len(state_machine.available_transitions()) == 3

    def test_can_transition(self):
        state_machine: StateMachine = StateMachine()
        state_machine.add_state("Idle")
        state_machine.add_state("Undefined")

        state_machine.add_transition("Undefined", StateTransition("save", "Idle"))
        with pytest.raises(StateMachineException) as excinfo:
            assert state_machine.can_transition("Idle")
        assert "uninitialized" in str(excinfo.value)

        state_machine.set_initial_state("Undefined")
        with pytest.raises(StateMachineException) as excinfo:
            assert state_machine.can_transition("Idle")
        assert "unknown transition" in str(excinfo.value)

        assert state_machine.can_transition("save")
        transition: StateTransition = state_machine.get_transition("Undefined", "save")
        transition.validate_method = lambda: True
        assert state_machine.can_transition("save")

        transition.validate_method = lambda: False
        assert not state_machine.can_transition("save")

    def test_execute_transition(self):
        state_machine: StateMachine = StateMachine()
        state_machine.add_state("Idle")
        state_machine.add_state("Undefined")

        state_machine.add_transition("Undefined", StateTransition("save", "Idle"))
        with pytest.raises(StateMachineException) as excinfo:
            assert state_machine.execute_transition("Idle")
        assert "uninitialized" in str(excinfo.value)

        state_machine.set_initial_state("Undefined")
        with pytest.raises(StateMachineException) as excinfo:
            assert state_machine.execute_transition("Idle")
        assert "unknown transition" in str(excinfo.value)

        state_machine.execute_transition("save")
        assert state_machine.get_state() == "IDLE"

        with pytest.raises(StateMachineException) as excinfo:
            assert state_machine.execute_transition("Idle")
        assert "unknown transition" in str(excinfo.value)

        assert not state_machine.next_states()

    def test_override_state(self):
        state_machine: StateMachine = StateMachine()
        state_machine.add_state("Idle")
        state_machine.add_state("Undefined")

        assert not state_machine.state
        with pytest.raises(StateMachineException) as excinfo:
            state_machine.override_state("GOAL")
        assert "unknown state" in str(excinfo.value)
        assert not state_machine.state

        state_machine.override_state("IDLE")
        assert state_machine.get_state() == "IDLE"

    def test_failed_state(self):
        state_machine: StateMachine = StateMachine()
        state_machine.add_state("IDLE")
        state_machine.add_state("STATE2")
        state_machine.add_state("STATE3")
        state_machine.set_initial_state("IDLE")

        state_machine.add_transition("IDLE", StateTransition("TRANSITION1", "STATE2",
                                                             transiton_method=lambda: True))
        state_machine.add_transition("STATE2", StateTransition("TRANSITION2", "STATE3",
                                                               transiton_method=lambda: False,
                                                               failed_state="IDLE"))
        state_machine.execute_transition("TRANSITION1")
        assert state_machine.get_state() == "STATE2"

        with pytest.raises(StateMachineException):
            state_machine.execute_transition("TRANSITION2")
        assert state_machine.get_state() == "IDLE"
