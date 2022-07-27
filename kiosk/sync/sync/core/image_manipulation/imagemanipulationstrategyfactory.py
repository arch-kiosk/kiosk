import logging
from typing import Generator

from image_manipulation.cv2qrcodethresholding import CV2QrCodeThresholding
from image_manipulation.imagemanipulationstrategy import ImageManipulationStrategy
from sync_config import SyncConfig
from yamlconfigreader import YAMLConfigReader


class ImageManipulationStrategyFactory:
    _image_manipulation_config = None

    @staticmethod
    def create_from_dict(strategy_id, data: dict):
        """
        creates an image manipulation strategy from a dict
        :param  strategy_id: an identifier for the strategy
        :param  data: a dict with data for the strategy
        :return: the strategy object.
        :except: KeyError if type is unknown
                 Other exceptions are possible

        todo: As soon as we have more than one rather static strategy here we should use the type repository
               and plugins should register ImageManipulationStrategy classes there.
        """

        strategy_type = data["type"]

        if strategy_type == "CV2QrCodeThresholding":
            strategy = CV2QrCodeThresholding(strategy_id, data)
        else:
            raise KeyError

        return strategy

    @classmethod
    def _get_image_manipulation_config(cls, reset=True):
        if reset or not cls._image_manipulation_config:
            sync_config = SyncConfig.get_config()
            try:
                filename = sync_config.resolve_symbols(sync_config.config["image_manipulation_config"])
                cls._image_manipulation_config = YAMLConfigReader(None).read_file(filename)
            except KeyError:
                logging.error(f"{cls.__name__}._get_image_manipulation_config: "
                              f" Key image_manipulation_config missing in config.")
                raise KeyError("Key image_manipulation_config missing in config")

    @classmethod
    def create_from_config(cls, strategy_id: str):
        cls._get_image_manipulation_config()
        strategies = cls._image_manipulation_config["strategies"]
        return cls.create_from_dict(strategy_id, strategies[strategy_id])

    @classmethod
    def get_image_manipulation_set_descriptors(cls) -> [dict]:
        """
        returns a list of dicts of the form {"id":, "name":, "description:"}
        :return:
        """
        cls._get_image_manipulation_config()
        sets = cls._image_manipulation_config["image_manipulation_sets"]
        set_descriptor = []
        for s in sets:
            set_descriptor.append({"id": s,
                                   "name": sets[s]["name"],
                                   "description": sets[s]["description"],
                                   })
        return set_descriptor

    @classmethod
    def get_image_manipulation_set_strategy_count(cls, set_id) -> int:
        try:
            cls._get_image_manipulation_config()
            manipulation_set = cls._image_manipulation_config["image_manipulation_sets"][set_id]
            if manipulation_set:
                return len(manipulation_set)
        except:
            pass

        return 0

    @classmethod
    def image_manipulation_set_strategies(cls, set_id) -> Generator[ImageManipulationStrategy, None, None]:
        cls._get_image_manipulation_config()
        manipulation_set = cls._image_manipulation_config["image_manipulation_sets"][set_id]
        for strategy_id in manipulation_set["strategies"]:
            strategy = cls.create_from_dict(strategy_id, cls._image_manipulation_config["strategies"][strategy_id])
            yield strategy
