import os
import secrets


class Config:
    """配置类"""

    # 数据库配置
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATABASE_PATH = os.path.join(os.path.dirname(BASE_DIR), "database", "ssq.db")

    # 数据源
    DATA_URL = "https://datachart.500.com/ssq/history/newinc/history.php"

    # Flask 配置
    SECRET_KEY = os.environ.get("SECRET_KEY") or secrets.token_hex(32)
    JSON_AS_ASCII = False
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DATABASE_PATH}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS 配置
    CORS_ORIGINS = os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:4200,http://localhost:4300,http://localhost:4400,http://127.0.0.1:4200,http://127.0.0.1:4300,http://127.0.0.1:4400",
    ).split(",")

    # 速率限制
    RATE_LIMIT = os.environ.get("RATE_LIMIT", "100 per hour")
