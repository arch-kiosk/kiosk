from core.config import Config


class KioskGlossary:
    def __init__(self, cfg: Config):
        self._glossary: dict = {}
        if cfg.has_key("glossary"):
            self._glossary: dict = cfg["glossary"]

    def get_all(self):
        """
        simply returns the glossary's internal dict
        """
        return self._glossary.items()

    def get_term(self, input_term, number, auto_plural=True):
        """
        returns a glossary term for a term and its number. Make sure that the input term is lowercase!
        :param input_term: a term that might translate into a different term
        :param number: the number that is asked for that term. E.g. 0..1: singular, else plural
        :param auto_plural: if False, a missing input term will not be pluralized by appending an s
        :returns: if there is a glossary entry for the input term it will be returned
        """
        index = 0 if 2 > number > -1 else 1

        try:
            glossary_entry = self._glossary[input_term]
            if isinstance(glossary_entry, str):
                term = glossary_entry
            else:
                if len(glossary_entry) > index:
                    return glossary_entry[index]
                else:
                    term = glossary_entry[0]

            return term if index == 0 or not auto_plural else term + "s"

        except KeyError:
            pass
        except ValueError:
            pass

        if index > 0 and auto_plural:
            return input_term + "s"
        else:
            return input_term
