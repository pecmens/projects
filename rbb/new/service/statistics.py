from typing import Dict, List, Tuple
from data.models import LotteryRecord
from common.statistics import StatisticsService as BaseStatisticsService


class StatisticsService(BaseStatisticsService):
    """统计分析服务（继承共享模块）"""

    def __init__(self, records):
        if records and isinstance(records[0], LotteryRecord):
            records_dict = [r.to_dict() for r in records]
        else:
            records_dict = records
        super().__init__(records_dict)

    def analyze_missing(self, recent_n: int = 30) -> Dict[str, Dict[str, int]]:
        """分析遗漏值（最近 N 期未出现的号码）"""
        recent_records = self.records[:recent_n]

        red_set = {str(i).zfill(2) for i in range(1, 34)}
        blue_set = {str(i).zfill(2) for i in range(1, 17)}

        recent_reds = {ball for r in recent_records for ball in r["red_balls"]}
        recent_blues = {r["blue_ball"] for r in recent_records}

        missing_reds = red_set - recent_reds
        missing_blues = blue_set - recent_blues

        return {
            "red": {num: recent_n for num in missing_reds},
            "blue": {num: recent_n for num in missing_blues},
        }
