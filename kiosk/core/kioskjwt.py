import jwt


class KioskJWT:

    def __init__(self, secret: str):
        self.secret = secret

    def encode(self, data: any) -> any:
        reset_token = jwt.encode(
            data,
            self.secret,
            algorithm="HS256"
        )
        return reset_token

    def check(self, token: any) -> any:
        data = jwt.decode(
            token,
            self.secret,
            algorithms=["HS256"]
        )
        return data

