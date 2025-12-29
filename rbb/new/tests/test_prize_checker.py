import pytest
from common.prize_checker import PrizeChecker


class TestPrizeChecker:
    """测试中奖核对服务"""

    def test_first_prize(self):
        """测试一等奖"""
        checker = PrizeChecker()
        record = {
            "red_balls": ["01", "03", "16", "18", "29", "33"],
            "blue_ball": "06",
        }
        user_numbers = {"red": ["01", "03", "16", "18", "29", "33"], "blue": "06"}
        result = checker.check(user_numbers, record)
        assert result == "一等奖"

    def test_second_prize(self):
        """测试二等奖"""
        checker = PrizeChecker()
        record = {
            "red_balls": ["01", "03", "16", "18", "29", "33"],
            "blue_ball": "06",
        }
        user_numbers = {"red": ["01", "03", "16", "18", "29", "33"], "blue": "05"}
        result = checker.check(user_numbers, record)
        assert result == "二等奖"

    def test_third_prize(self):
        """测试三等奖"""
        checker = PrizeChecker()
        record = {
            "red_balls": ["01", "03", "16", "18", "29", "33"],
            "blue_ball": "06",
        }
        user_numbers = {"red": ["01", "03", "16", "18", "29", "05"], "blue": "06"}
        result = checker.check(user_numbers, record)
        assert result == "三等奖"

    def test_no_prize(self):
        """测试未中奖"""
        checker = PrizeChecker()
        record = {
            "red_balls": ["01", "03", "16", "18", "29", "33"],
            "blue_ball": "06",
        }
        user_numbers = {"red": ["02", "04", "06", "08", "10", "12"], "blue": "05"}
        result = checker.check(user_numbers, record)
        assert result == "未中奖"

    def test_batch_check(self):
        """测试批量核对"""
        checker = PrizeChecker()
        records = [
            {"red_balls": ["01", "03", "16", "18", "29", "33"], "blue_ball": "06"},
            {"red_balls": ["01", "03", "16", "18", "29", "33"], "blue_ball": "06"},
        ]
        user_numbers = {"red": ["01", "03", "16", "18", "29", "33"], "blue": "06"}
        results = checker.batch_check(user_numbers, records)
        assert results.get("一等奖") == 2