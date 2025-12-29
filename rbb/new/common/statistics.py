from typing import Dict, List, Tuple
from collections import Counter


class StatisticsService:
    """统计分析服务"""

    def __init__(self, records: List[Dict]):
        self.records = records

    def red_ball_frequency(self, top_n: int = 33) -> List[Tuple[str, int]]:
        """红球频率统计"""
        all_reds = [ball for record in self.records for ball in record["red_balls"]]
        counter = Counter(all_reds)
        return counter.most_common(top_n)

    def blue_ball_frequency(self, top_n: int = 16) -> List[Tuple[str, int]]:
        """蓝球频率统计"""
        all_blues = [record["blue_ball"] for record in self.records]
        counter = Counter(all_blues)
        return counter.most_common(top_n)

    def get_hot_numbers(self, red_count: int = 6, blue_count: int = 3) -> Dict[str, List[str]]:
        """获取热号"""
        hot_reds = [num for num, _ in self.red_ball_frequency(red_count)]
        hot_blues = [num for num, _ in self.blue_ball_frequency(blue_count)]
        return {"red": hot_reds, "blue": hot_blues}

    def get_cold_numbers(self, red_count: int = 6, blue_count: int = 3) -> Dict[str, List[str]]:
        """获取冷号"""
        cold_reds = [num for num, _ in self.red_ball_frequency()[-red_count:]]
        cold_blues = [num for num, _ in self.blue_ball_frequency()[-blue_count:]]
        return {"red": cold_reds, "blue": cold_blues}