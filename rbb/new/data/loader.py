from typing import List

from .fetcher import DataFetcher
from .models import LotteryRecord
from .storage import CSVStorage


class DataLoader:
    """数据加载器（支持缓存和增量更新）"""

    def __init__(self, fetcher: DataFetcher, storage: CSVStorage):
        self.fetcher = fetcher
        self.storage = storage

    def load(self, force_refresh: bool = False) -> List[LotteryRecord]:
        """
        加载数据（优先使用缓存）

        Args:
            force_refresh: 是否强制刷新数据

        Returns:
            List[LotteryRecord]: 开奖记录列表
        """
        if not force_refresh:
            cached = self.storage.load()
            if cached:
                return cached

        # 抓取最新数据
        records = self.fetcher.fetch()
        self.storage.save(records)
        return records

    def update_incremental(self) -> List[LotteryRecord]:
        """增量更新数据"""
        cached = self.storage.load()
        if not cached:
            return self.load(force_refresh=True)

        latest_times = int(cached[0].times)
        # 抓取最新数据（从最新期号+1开始）
        new_records = self.fetcher.fetch(start=latest_times + 1)

        if new_records:
            # 合并数据（新数据在前）
            all_records = new_records + cached
            self.storage.save(all_records)
            return all_records

        return cached
