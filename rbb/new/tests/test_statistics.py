import pytest
from common.statistics import StatisticsService


class TestStatisticsService:
    """测试统计分析服务"""

    def test_red_ball_frequency(self):
        """测试红球频率统计"""
        records = [
            {"red_balls": ["01", "02", "03", "04", "05", "06"], "blue_ball": "01"},
            {"red_balls": ["01", "02", "03", "04", "05", "07"], "blue_ball": "02"},
            {"red_balls": ["01", "02", "03", "04", "05", "08"], "blue_ball": "03"},
        ]
        service = StatisticsService(records)
        freq = service.red_ball_frequency(10)
        assert len(freq) > 0
        assert freq[0][1] == 3  # "01" 出现 3 次

    def test_blue_ball_frequency(self):
        """测试蓝球频率统计"""
        records = [
            {"red_balls": ["01", "02", "03", "04", "05", "06"], "blue_ball": "01"},
            {"red_balls": ["01", "02", "03", "04", "05", "07"], "blue_ball": "01"},
            {"red_balls": ["01", "02", "03", "04", "05", "08"], "blue_ball": "02"},
        ]
        service = StatisticsService(records)
        freq = service.blue_ball_frequency(10)
        assert len(freq) > 0
        assert freq[0][1] == 2  # "01" 出现 2 次

    def test_get_hot_numbers(self):
        """测试获取热号"""
        records = [
            {"red_balls": ["01", "02", "03", "04", "05", "06"], "blue_ball": "01"},
            {"red_balls": ["01", "02", "03", "04", "05", "07"], "blue_ball": "01"},
            {"red_balls": ["01", "02", "03", "04", "05", "08"], "blue_ball": "02"},
        ]
        service = StatisticsService(records)
        hot = service.get_hot_numbers(3, 2)
        assert "red" in hot
        assert "blue" in hot
        assert len(hot["red"]) == 3
        assert len(hot["blue"]) == 2

    def test_get_cold_numbers(self):
        """测试获取冷号"""
        records = [
            {"red_balls": ["01", "02", "03", "04", "05", "06"], "blue_ball": "01"},
            {"red_balls": ["01", "02", "03", "04", "05", "07"], "blue_ball": "01"},
            {"red_balls": ["01", "02", "03", "04", "05", "08"], "blue_ball": "02"},
        ]
        service = StatisticsService(records)
        cold = service.get_cold_numbers(3, 2)
        assert "red" in cold
        assert "blue" in cold
        assert len(cold["red"]) == 3
        assert len(cold["blue"]) == 2