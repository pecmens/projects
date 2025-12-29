from typing import List, Optional

from data.models import LotteryRecord


class QueryService:
    """查询服务"""

    def __init__(self, records: List[LotteryRecord]):
        self.records = records
        self._times_index = {r.times: r for r in records}
        self._date_index = {r.date: r for r in records}

    def query_by_times(self, times: str) -> Optional[LotteryRecord]:
        """按期号查询"""
        return self._times_index.get(times)

    def query_by_date(self, date: str) -> Optional[LotteryRecord]:
        """按日期查询"""
        return self._date_index.get(date)

    def query_range(self, start_times: str, end_times: str) -> List[LotteryRecord]:
        """按期号范围查询"""
        start = int(start_times)
        end = int(end_times)
        return [r for r in self.records if start <= int(r.times) <= end]

    def search_by_red_balls(self, red_balls: List[str]) -> List[LotteryRecord]:
        """按红球组合查询"""
        return [r for r in self.records if set(r.red_balls) == set(red_balls)]
