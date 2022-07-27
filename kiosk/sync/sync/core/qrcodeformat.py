import urapdatetimelib
import logging
import datetime

CURRENT_VERSION = 1


class QRCodeFormat:
    raw_data: str
    data: str = None
    ver: int = 0
    timestamp: datetime.datetime = None

    def decode(self):
        """
        decodes the raw_data read from a qr code. The result is stored in the property data.
        :return no return code but can raise an Exception.
        """
        if self.raw_data:
            if self.raw_data[0] == "$":
                ver = self.raw_data.split("$")[1]
                self.ver = int(ver.split(":")[1])
                if self.ver == 1:
                    return self._decode_raw_data_v1()
                else:
                    logging.error(f"{self.__class__.__name__}.decode: no raw data given")
            else:
                self.data = self.raw_data
                return True
        else:
            logging.error(f"{self.__class__.__name__}.decode: no raw data given")

        return False

    def _decode_raw_data_v1(self):
        """
        decodes data in the format v1 from the raw_data.
        :returns: True or throws an Exception. The resulting data in in attribute data
        """
        data_items = self.raw_data.split("$")
        data = data_items[2]
        if data[0:2] == "D:":
            self.data = data[2:]
        else:
            raise Exception(f"{self.__class__.__name__}._decode_raw_data_v1: "
                            f"D: missing in raw data")

        timestamp = data_items[3]
        if timestamp[0:3] == "TS:":
            self.timestamp = urapdatetimelib.guess_datetime(timestamp[3:])
        else:
            raise Exception(f"{self.__class__.__name__}._decode_raw_data_v1: TS: missing "
                            f"in TimeStamp part of qrcode.")
        return True

    def encode(self):
        """
        encodes the attribute data to the current qr code format
        :return: true/false and the resulting data is in raw_data
        """
        if not self.data:
            raise Exception(f"{self.__class__.__name__}.encode: no data.")
        if not self.timestamp:
            raise Exception(f"{self.__class__.__name__}.encode: no timestamp.")
        urap_timestamp = self.timestamp.strftime("%Y-%m-%d %H:%M:%S")

        self.raw_data = f"$V:{CURRENT_VERSION}$D:{self.data}$TS:{urap_timestamp}"
        return True
