from eventmanager import EventManager, EventHandler
from functools import reduce
import pytest


class TestEventManager:
    log = []

    # def __init__(self):
    #     self._log = []

    @pytest.fixture(autouse=True)
    def init_test(self):
        self._log = []

    def log(self, msg):
        if not msg:
            self._log = []
        else:
            self._log.append(msg)

    def callable1(self, param1, param2):
        self.log("callable1: {} {}".format(param1, param2))

    def callable2(self, param1, param2):
        self.log("callable2: {} {}".format(param1, param2))

    def callable3(self, param1, param2):
        self.log("callable3: {} {}".format(param1, param2))

    def callable4(self, param1, param2):
        self.log("callable4: {} {}".format(param1, param2))

    def observer_1(self):
        self.log("1-")

    def observer_2(self):
        self.log("2-")

    def observer_3(self):
        self.log("3-")

    def test_get_event_handler(self):
        em = EventManager()
        em.subscribe("topic1", "topic1_event1", self.callable1)
        em.subscribe("topic1", "topic1_event1", self.callable2)
        em.subscribe("topic1", "topic1_event2", self.callable3)
        em.subscribe("topic2", "topic2_event1", self.callable4)
        assert self.callable1 in em.get_event_handler("topic1", "topic1_event1")._observers

        assert self.callable1 in em.get_event_handler("topic1", "topic1_event1")._observers
        assert self.callable2 in em.get_event_handler("topic1", "topic1_event1")._observers
        assert self.callable3 not in em.get_event_handler("topic1", "topic1_event1")._observers
        assert self.callable3 in em.get_event_handler("topic1", "topic1_event2")._observers
        assert self.callable4 not in em.get_event_handler("topic1", "topic1_event1")._observers
        assert self.callable4 in em.get_event_handler("topic2", "topic2_event1")._observers

    def test_fire_event(self):
        em = EventManager()
        em.fire_event("topic1", "topic1_event1", "test_fire_event_param1", "test_fire_event_param2")

        em.subscribe("topic1", "topic1_event1", self.callable1)
        em.subscribe("topic1", "topic1_event1", self.callable2)
        em.subscribe("topic1", "topic1_event2", self.callable3)
        em.subscribe("topic2", "topic2_event1", self.callable4)
        em.fire_event("topic1", "topic1_event1", "test_fire_event_param1", "test_fire_event_param2")
        assert "test_fire_event_param1" in str(self._log)
        assert "test_fire_event_param1" in str(self._log)
        assert "callable1" in str(self._log)
        assert "callable2" in str(self._log)
        assert "callable3" not in str(self._log)
        assert "callable4" not in str(self._log)

        self.log(msg=None)
        assert len(self._log) == 0

        em.fire_event("topic1", "topic1_event2", "test_fire_event_param1", "test_fire_event_param2")
        assert "test_fire_event_param1" in str(self._log)
        assert "test_fire_event_param1" in str(self._log)
        assert "callable1" not in str(self._log)
        assert "callable2" not in str(self._log)
        assert "callable3" in str(self._log)
        assert "callable4" not in str(self._log)

    def test_unsubscribe(self):
        em = EventManager()
        em.subscribe("topic1", "topic1_event1", self.callable1)
        em.subscribe("topic1", "topic1_event1", self.callable2)
        em.fire_event("topic1", "topic1_event1", "test_fire_event_param1", "test_fire_event_param2")
        assert "test_fire_event_param1" in str(self._log)
        assert "test_fire_event_param1" in str(self._log)
        assert "callable1" in str(self._log)
        assert "callable2" in str(self._log)

        self.log(msg=None)
        assert len(self._log) == 0

        handler = em.get_event_handler("topic1", "topic1_event1")
        handler.unsubscribe(self.callable1)
        em.fire_event("topic1", "topic1_event1", "test_fire_event_param1", "test_fire_event_param2")
        assert "test_fire_event_param1" in str(self._log)
        assert "test_fire_event_param1" in str(self._log)
        assert "callable1" not in str(self._log)
        assert "callable2" in str(self._log)

        self.log(msg=None)
        assert len(self._log) == 0

        handler = em.get_event_handler("topic1", "topic1_event1")
        handler.unsubscribe(self.callable2)
        em.fire_event("topic1", "topic1_event1", "test_fire_event_param1", "test_fire_event_param2")
        assert "test_fire_event_param1" not in str(self._log)
        assert "test_fire_event_param1" not in str(self._log)
        assert "callable1" not in str(self._log)
        assert "callable2" not in str(self._log)

    def test_fire_strategies(self):
        em = EventManager()
        em.subscribe("topic1", "event", self.observer_1)
        em.subscribe("topic1", "event", self.observer_2)
        em.subscribe("topic1", "event", self.observer_3)

        em.fire_event("topic1", "event")
        assert "1-2-3-" == reduce(lambda x,y: x + y, self._log)

        self.log(msg=None)
        assert len(self._log) == 0

        handler = em.get_event_handler("topic1", "event")
        handler.fire_fifs()
        assert "1-2-3-" == reduce(lambda x,y: x + y, self._log)

        self.log(msg=None)
        assert len(self._log) == 0

        handler = em.get_event_handler("topic1", "event")
        handler.fire_lifs()
        assert "1-2-3-" != reduce(lambda x,y: x + y, self._log)
        assert "3-2-1-" == reduce(lambda x,y: x + y, self._log)

        self.log(msg=None)
        assert len(self._log) == 0

        handler = em.get_event_handler("topic1", "event")
        handler.fire_last_in_only()
        assert "3-" == reduce(lambda x,y: x + y, self._log)

        self.log(msg=None)
        assert len(self._log) == 0

        handler = em.get_event_handler("topic1", "event")
        handler.fire_first_in_only()
        assert "1-" == reduce(lambda x,y: x + y, self._log)


