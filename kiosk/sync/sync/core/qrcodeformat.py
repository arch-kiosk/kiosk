import urapdatetimelib
import logging
import datetime

CURRENT_VERSION = 3


class QRCodeFormat:
    raw_data: str
    data: str = None
    ver: int = 0
    timestamp: datetime.datetime = None
    qr_code_type = ""

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
                elif self.ver == 3:
                    return self._decode_raw_data_v3()
                else:
                    logging.error(f"{self.__class__.__name__}.decode: no raw data given or "
                                  f"version {self.ver} not supported.")
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

        if len(data_items) > 3:
            timestamp = data_items[3]
            if timestamp[0:3] == "TS:":
                self.timestamp = urapdatetimelib.guess_datetime(timestamp[3:])
            else:
                raise Exception(f"{self.__class__.__name__}._decode_raw_data_v1: TS: missing "
                                f"in TimeStamp part of qrcode.")
        else:
            logging.warning(f"{self.__class__.__name__}._decode_raw_data_v1: TS: missing "
                            f"in TimeStamp part of qrcode.")

        return True

    def _decode_raw_data_v3(self):
        """
        decodes data in the format v3 from the raw_data.
        :returns: True or throws an Exception. The resulting data in in attribute data
        """
        data_items = self.raw_data.split("$")
        self.data = ""
        self.timestamp = None
        self.qr_code_type = ""

        for data in data_items:
            if data.strip():
                if data[0:2] == "D:":
                    self.data = data[2:]

                elif data[0:3] == "TS:":
                    self.timestamp = urapdatetimelib.guess_datetime(data[3:])
                elif data[0:2] == "T:":
                    self.qr_code_type = data[2:]
                elif data[0:2] == "V:":
                    pass
                else:
                    logging.warning(f"{self.__class__.__name__}._decode_raw_data_v3: Unknown datum \"{data}\"")

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
        if not self.qr_code_type:
            self.qr_code_type = "S"
            logging.debug(f"{self.__class__.__name__}.encode: no qr_code_type.")

        urap_timestamp = self.timestamp.strftime("%Y-%m-%d %H:%M:%S")

        self.raw_data = f"$V:{CURRENT_VERSION}$D:{self.data}$TS:{urap_timestamp}$T:{self.qr_code_type}"
        return True
