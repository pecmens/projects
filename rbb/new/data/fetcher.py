from typing import List, Optional
from .models import LotteryRecord
from common.data_fetcher import DataFetcher as BaseDataFetcher


class DataFetcher(BaseDataFetcher):
    """双色球数据抓取器（继承共享模块）"""

    def fetch(self, start: int = 1, end: Optional[int] = None) -> List[LotteryRecord]:
        """
        抓取双色球历史数据

        Args:
            start: 起始期号
            end: 结束期号（可选，默认抓取全部）

        Returns:
            List[LotteryRecord]: 开奖记录列表
        """
        raw_records = super().fetch(start, end)
        return [
            LotteryRecord(
                times=r["times"],
                red_balls=r["red_balls"],
                blue_ball=r["blue_ball"],
                date=r["date"],
            )
            for r in raw_records
        ]
