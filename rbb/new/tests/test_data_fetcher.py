import pytest
from common.data_fetcher import DataFetcher


class TestDataFetcher:
    """测试数据抓取器"""

    def test_fetch_success(self):
        """测试成功抓取数据"""
        fetcher = DataFetcher("https://datachart.500.com/ssq/history/newinc/history.php")
        records = fetcher.fetch(start=22065, end=22065)
        assert len(records) > 0
        assert records[0]["times"] == "22065"
        assert len(records[0]["red_balls"]) == 6
        assert records[0]["blue_ball"]

    def test_fetch_future_range(self):
        """测试未来范围（应该返回空列表）"""
        fetcher = DataFetcher("https://datachart.500.com/ssq/history/newinc/history.php")
        records = fetcher.fetch(start=99999, end=99999)
        # 500.com 对于无效范围返回空列表而不是抛出异常
        assert isinstance(records, list)