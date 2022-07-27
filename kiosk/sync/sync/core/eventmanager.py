import logging


class EventHandler:
    """ class to register observers and call them in case the event is getting triggered (fired).

        set exception_handling to a combination of ON_EXCEPTION constants to set a spefific behaviour in case an obsever
        fires an exception. Default is that the exception is logged and the next observer is triggered.
    """

    ON_EXCEPTION_RAISE = 1
    ON_EXCEPTION_CONTINUE = 0
    ON_EXCEPTION_LOG = 4

    def __init__(self):
        self._observers = []
        self.exception_handling = self.ON_EXCEPTION_LOG | self.ON_EXCEPTION_CONTINUE

    def subscribe(self, observer: callable):
        self._observers.append(observer)

    def unsubscribe(self, observer: callable):
        if observer in self._observers:
            self._observers.remove(observer)

    def unsubscribe_all(self):
        self._observers = []

    def _fire_observers(self, observers, *args, **kwargs):
        rc = None
        for obs in observers:
            try:
                rc = obs(*args, **kwargs)
            except Exception as e:
                if self.exception_handling & self.ON_EXCEPTION_LOG:
                    logging.error(f"EventHandler.fire_fifs: Exception when triggering observer {repr(e)}")
                if self.exception_handling & self.ON_EXCEPTION_RAISE:
                    raise e
                if not self.exception_handling & self.ON_EXCEPTION_CONTINUE:
                    break
        if len(observers) == 1:
            return rc
        else:
            return None

    def fire_fifs(self, *args, **kwargs):
        self._fire_observers(self._observers, *args, **kwargs)

    def fire_lifs(self, *args, **kwargs):
        self._fire_observers(list(reversed(self._observers)), *args, **kwargs)

    def fire_last_in_only(self, *args, **kwargs):
        return self._fire_observers([self._observers[-1]], *args, **kwargs)

    def fire_first_in_only(self, *args, **kwargs):
        return self._fire_observers([self._observers[0]], *args, **kwargs)


class EventManager:
    """ class to register and fire observers under a topic and an id """

    def __init__(self):
        self._events = {}

    def get_event_handler(self, topic: str, event_id: str) -> EventHandler:
        """ returns the eventhandler for the given topic and event. Does not throw exceptions but might return None
            if the event or topic does not exist  """
        try:
            handler = self._events[topic][event_id]
            return handler
        except Exception as e:
            return None

    def subscribe(self, topic: str, event_id: str, observer: callable):
        """ Registers a callable method a topic and an event name """

        if topic not in self._events:
            self._events[topic] = {}

        handler = self.get_event_handler(topic, event_id)

        if not handler:
            handler = EventHandler()
            self._events[topic][event_id] = handler

        handler.subscribe(observer)

    def fire_event(self, topic, event_id, *args, **kwargs):
        """ fifo-fires all event handlers listening to the topic and the event_id """
        handler = self.get_event_handler(topic, event_id)
        if handler:
            handler.fire_fifs(*args, **kwargs)
