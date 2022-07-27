# from sqlalchemy.ext.declarative import declarative_base
#
#
# class SyncDeclarativeBase:
#
#     _declarative_base = None
#
#     @classmethod
#     def get_declarative_base(cls):
#         """
#             returns the sql-alchemy declarative base within console apps.
#             In Kiosk the declarative base is in kioskglobals.sqlalchemy_db and
#             is initialized by flask-sqlalchemy.
#
#             This is a singleton call!
#
#         :return: sql alchemy declarative base
#         """
#         if not cls._declarative_base:
#             cls._declarative_base = declarative_base()
#
#         return cls._declarative_base
