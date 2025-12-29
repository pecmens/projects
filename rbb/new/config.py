from pathlib import Path


class Config:
    """配置管理"""

    # 数据源
    DATA_URL = "https://datachart.500.com/ssq/history/newinc/history.php"

    # 存储路径
    PROJECT_ROOT = Path(__file__).parent
    DATA_DIR = PROJECT_ROOT / "data_files"
    STORAGE_PATH = DATA_DIR / "ssq_data.csv"
    LOG_FILE = PROJECT_ROOT / "ssq.log"

    # 请求配置
    REQUEST_TIMEOUT = 30
    REQUEST_INTERVAL = 1  # 秒

    # 业务配置
    DEFAULT_RECENT_COUNT = 30  # 统计最近 N 期
    HOT_NUMBERS_COUNT = 6  # 热号数量
    COLD_NUMBERS_COUNT = 6  # 冷号数量

    @classmethod
    def ensure_dirs(cls):
        """确保目录存在"""
        cls.DATA_DIR.mkdir(parents=True, exist_ok=True)
