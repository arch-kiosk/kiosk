from kioskconfig import KioskConfig
from flask_sqlalchemy import SQLAlchemy

sqlalchemy_db = None


def set_sqlalchemy_uri(cfg: KioskConfig):
    user_id = cfg.config["database_usr_name"]
    user_pwd = cfg.config["database_usr_pwd"]
    database_name = cfg.config["database_name"]
    database_port = cfg.config["database_port"] if "database_port" in cfg.config else 5432
    database_host = cfg.config["database_host"] if "database_host" in cfg.config else "localhost"

    cfg["Flask"]["SQLALCHEMY_DATABASE_URI"] = f"postgresql+psycopg2://" \
                                              f"{user_id}:{user_pwd}@{database_host}:{database_port}/{database_name}"
    print(f'SQLAlchemy URI is {cfg["Flask"]["SQLALCHEMY_DATABASE_URI"]}')


def init_sql_alchemy(app, cfg: KioskConfig):
    global sqlalchemy_db
    sqlalchemy_db.init_app(app)


def instantiate_sqlalchemy_db():
    global sqlalchemy_db
    sqlalchemy_db = SQLAlchemy()
