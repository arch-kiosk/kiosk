from PIL import Image
from pyzbar.pyzbar import decode
from pyzbar.pyzbar import ZBarSymbol
import logging
import rawpy
import datetime
from qrcodeformat import QRCodeFormat


class QRCodedFile:
    SUPPORTED_FILE_EXTENSIONS = [".nef", ".tif", ".jpg", ".jpeg", ".png", ".bmp", ".gif"]
    src_file: str = None
    raw_data: str
    data: str = None
    timestamp: datetime.datetime = None

    def __init__(self, src_file: str = ""):
        self.src_file = src_file

    def decode(self, scan_only=False):
        """
        Decodes all the QR Codes in the image set via src_file. It then decodes the QR-Code information further
        and returns the information for the recording system: timestamp, data etc.

        :param scan_only: if set the method will return the raw zbar results and not decode those results any further.

        :return: usually True or False, unless scan_only is set, in which case the raw zbar results will be returned.
                 In case of True the decoded data is stored in the properties raw_data and data.
        """
        if not self.src_file:
            logging.error("qrsort.decode: src_file is None.")
            return False

        ext = self.src_file[-4:].lower()
        if ext not in self.SUPPORTED_FILE_EXTENSIONS:
            logging.error("QRSort.decode: {} is not a supported file extension".format(ext))

        img = None
        if ext == ".nef":
            try:
                with rawpy.imread(self.src_file) as raw:
                    rgb = raw.postprocess()
                img = Image.fromarray(rgb)
            except Exception as e:
                logging.error("QRSort.decode: Exception when opening NEF {}: {}".format(self.src_file, repr(e)))
        else:
            try:
                img = Image.open(self.src_file)
            except Exception as e:
                logging.error("QRSort.decode: Exception when opening {}: {}".format(self.src_file, repr(e)))

        rc = self._decode_img(img, scan_only)

        return rc

    def quick_decode(self, np_array):
        """
        Decodes all the QR Codes in the image given as a numpy array.
        It then decodes the QR-Code information further and returns the information for the recording system:
        timestamp, data etc.

        :param np_array: a numpy ndarray.

        :return: True or False. In case of True the decoded data is stored in the properties raw_data and data.
        """
        return self._decode_img(np_array, False)

    def _decode_img(self, img, scan_only):
        """
        Decodes all the QR Codes in the image given as an array. It then decodes the QR-Code information further
        and returns the information for the recording system: timestamp, data etc.

        :param img: a Pillow Image object or a numpy ndarray.
        :param scan_only: if set the method will return the raw zbar results and not decode those results any further.

        :return: usually True or False, unless scan_only is set, in which case the raw zbar results will be returned.
                 In case of True the decoded data is stored in the properties raw_data and data.

        """
        rc = False
        if img is not None:
            decoded = decode(img, symbols=[ZBarSymbol.QRCODE])
            if scan_only:
                rc = decoded
            else:
                if decoded:
                    if len(decoded) == 1:
                        qr = decoded[0]
                        fmt = QRCodeFormat()
                        fmt.raw_data = qr.data.decode("UTF-8")
                        if fmt.decode():
                            self.data = fmt.data
                            self.timestamp = fmt.timestamp
                            rc = True
                        else:
                            rc = False
                    else:
                        logging.debug(f"QRCodedFile._decode_img: More than one QRCode"
                                      f"in image {self.src_file} decoded.")

        return rc

