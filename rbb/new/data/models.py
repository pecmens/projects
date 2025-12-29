from dataclasses import dataclass
from typing import Dict, List


@dataclass
class LotteryRecord:
    """双色球开奖记录"""

    times: str  # 期号，如 "22065"
    red_balls: List[str]  # 红球列表，如 ["09", "14", "18", "23", "28", "31"]
    blue_ball: str  # 蓝球，如 "02"
    date: str  # 开奖日期，如 "2022-06-09"

    def to_dict(self) -> Dict[str, str]:
        """转换为字典格式（用于 CSV 存储）"""
        return {
            "times": self.times,
            "red_balls": self.red_balls,
            "blue_ball": self.blue_ball,
            "date": self.date,
            "rb1": self.red_balls[0],
            "rb2": self.red_balls[1],
            "rb3": self.red_balls[2],
            "rb4": self.red_balls[3],
            "rb5": self.red_balls[4],
            "rb6": self.red_balls[5],
            "bb": self.blue_ball,
            "dates": self.date,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, str]) -> "LotteryRecord":
        """从字典创建实例"""
        return cls(
            times=data["times"],
            red_balls=[data[f"rb{i}"] for i in range(1, 7)],
            blue_ball=data["bb"],
            date=data["dates"],
        )
