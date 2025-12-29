import csv
from pathlib import Path
from typing import List, Optional

from .models import LotteryRecord


class CSVStorage:
    """CSV 数据存储"""

    def __init__(self, filepath: str):
        self.filepath = Path(filepath)
        self.headers = ["times", "rb1", "rb2", "rb3", "rb4", "rb5", "rb6", "bb", "dates"]

    def save(self, records: List[LotteryRecord], mode: str = "w"):
        """
        保存数据到 CSV

        Args:
            records: 开奖记录列表
            mode: 写入模式，'w' 覆盖，'a' 追加
        """
        self.filepath.parent.mkdir(parents=True, exist_ok=True)

        with open(self.filepath, mode, encoding="utf-8-sig", newline="") as f:
            writer = csv.DictWriter(f, self.headers)
            if mode == "w" or not self.filepath.exists():
                writer.writeheader()
            for record in records:
                writer.writerow(record.to_dict())

    def load(self) -> List[LotteryRecord]:
        """从 CSV 加载数据"""
        if not self.filepath.exists():
            return []

        records = []
        with open(self.filepath, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                records.append(LotteryRecord.from_dict(row))
        return records

    def get_latest_times(self) -> Optional[int]:
        """获取最新期号"""
        records = self.load()
        if not records:
            return None
        return int(records[0].times)
