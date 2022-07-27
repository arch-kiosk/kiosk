from qrcodeformat import QRCodeFormat
import datetime


class TestQRCodeFormat:

    def test_encode(self):
        fmt = QRCodeFormat()
        fmt.data = "the data"
        fmt.timestamp = datetime.datetime(year=2019, month=1, day=1, hour=23, minute=12, second=2)
        assert fmt.encode()
        assert fmt.raw_data == "$V:1$D:the data$TS:2019-01-01 23:12:02"

        fmt = QRCodeFormat()
        fmt.data = "the data"
        fmt.timestamp = datetime.datetime(year=2019, month=1, day=1, hour=1, minute=12, second=2)
        assert fmt.encode()
        assert fmt.raw_data == "$V:1$D:the data$TS:2019-01-01 01:12:02"

    def test_decode(self):
        fmt = QRCodeFormat()
        fmt.raw_data = "$V:1$D:the data$TS:2019-01-01 23:12:02"
        assert fmt.decode()
        assert fmt.ver == 1
        assert fmt.data == "the data"
        assert fmt.timestamp == datetime.datetime(year=2019, month=1, day=1, hour=23, minute=12, second=2)

        fmt = QRCodeFormat()
        fmt.raw_data = "$V:1$D:the data$TS:2019-01-01 01:12:02"
        assert fmt.decode()
        assert fmt.ver == 1
        assert fmt.data == "the data"
        assert fmt.timestamp == datetime.datetime(year=2019, month=1, day=1, hour=1, minute=12, second=2)
