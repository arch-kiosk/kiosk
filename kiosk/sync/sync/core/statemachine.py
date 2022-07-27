class StateMachineException(Exception):
    pass


class StateTransition:
    def __init__(self, transition_name: str, target_state: str, validate_method: callable = None,
                 transiton_method: callable = None, failed_state: str = None):
        self.transition_name = transition_name.upper()
        self.target_state = target_state.upper()
        self.validate_method = validate_method
        self.transition_method = transiton_method
        self.failed_state = failed_state


class StateMachine:

    def __init__(self):
        self.states_and_transitions = {}
        self.state = None

    def state_exists(self, state_name: str):
        """ checks if the given state (string) is a known state """
        return state_name in self.states_and_transitions

    def add_state(self, state_name: str):
        state_name = state_name.upper()
        if self.state_exists(state_name):
            raise StateMachineException("Call to StateMachine.add_state but {} already exists.".format(state_name))
        else:
            self.states_and_transitions[state_name] = {}

    def set_initial_state(self, state_name: str):
        state_name = state_name.upper()
        if self.state:
            raise StateMachineException("Call to StateMachine.set_initial_state but state is not None.")

        if state_name in self.states_and_transitions:
            self.state = state_name
        else:
            raise StateMachineException(
                "Call to StateMachine.set_initial_state trying to set initial state to an unknown state.")

    def add_transition(self, origin_state: str, transition: StateTransition):
        origin_state = origin_state.upper()
        if transition.target_state in self.states_and_transitions:
            if origin_state in self.states_and_transitions:
                state = self.states_and_transitions[origin_state]
                if transition.transition_name not in state:
                    state[transition.transition_name] = transition
                else:
                    raise StateMachineException(
                        "Call to StateMachine.add_transition but transition {} already exists.".format(
                            transition.transition_name))
            else:
                raise StateMachineException(
                    "Call to StateMachine.add_transition with unknown origin_state: {}".format(origin_state))
        else:
            raise StateMachineException(
                "Call to StateMachine.add_transition with unknown target_state: {}".format(transition.target_state))

    def get_transition(self, origin_state: str, transition_name: str):
        origin_state = origin_state.upper()
        if origin_state in self.states_and_transitions:
            transition_name = transition_name.upper()
            if transition_name in self.states_and_transitions[origin_state]:
                return self.states_and_transitions[origin_state][transition_name]
            else:
                raise StateMachineException(
                    "Call to StateMachine.get_transition with unknown transition: {}".format(transition_name))
        else:
            raise StateMachineException(
                "Call to StateMachine.add_transition with unknown origin_state: {}".format(origin_state))

    def get_state(self):
        """ :returns: the current state (string) """
        return self.state

    def override_state(self, state):
        """ Forces the machine to a given state without checking or using a transition. The state must exist, though."""
        state = state.upper()
        if state in self.states_and_transitions:
            self.state = state
            return True

        else:
            raise StateMachineException("Call to StateMachine.override_state with unknown state {}".format(state))

        return False

    def next_states(self):
        if not self.state:
            raise StateMachineException(
                "Call to StateMachine.next_states for state machine with uninitialized state")

        return set(
            [self.states_and_transitions[self.state][x].target_state for x in self.states_and_transitions[self.state]])

    def available_transitions(self):
        if not self.state:
            raise StateMachineException(
                "Call to StateMachine.possible_transitions for state machine with uninitialized state")

        return [x for x in self.states_and_transitions[self.state]]

    def can_transition(self, transition_name: str):
        if not self.state:
            raise StateMachineException(
                "Call to StateMachine.can_transition for state machine with uninitialized state")

        try:
            transition = self.get_transition(self.state, transition_name)
            # there is no validation method? Good, then the transition has no preconditions
            if transition.validate_method:
                if not transition.validate_method():
                    return False
            return True

        except KeyError as e:
            raise StateMachineException("Call to StateMachine.can_transition with unknown transition.")

    def execute_transition(self, transition_name: str):
        if not self.state:
            raise StateMachineException(
                "Call to StateMachine.execute_transition for state machine with uninitialized state")

        if self.can_transition(transition_name):
            transition: StateTransition = self.get_transition(self.state, transition_name)
            try:
                # if there is no transition method, that's fine. The transition can just be executed
                if transition.transition_method:
                    if not transition.transition_method():
                        raise StateMachineException(
                            "execute_transition of transition {} failed.".format(transition_name))

                self.state = transition.target_state
            except BaseException as e:
                try:
                    if transition.failed_state:
                        self.state = transition.failed_state
                except BaseException as e2:
                    pass
                raise e
        else:
            raise StateMachineException("StateMachine.transition not possible because can_transition returned False")
