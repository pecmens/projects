import pytest
from utils.validators import (
    validate_red_balls,
    validate_blue_ball,
    validate_times,
    validate_date
)


class TestValidators:
    """测试输入验证"""
    
    def test_validate_red_balls_valid(self):
        """测试有效的红球输入"""
        assert validate_red_balls(["01", "03", "16", "18", "29", "33"]) == True
    
    def test_validate_red_balls_invalid_count(self):
        """测试红球数量错误"""
        assert validate_red_balls(["01", "03", "16", "18", "29"]) == False
    
    def test_validate_red_balls_duplicate(self):
        """测试红球重复"""
        assert validate_red_balls(["01", "03", "16", "18", "29", "29"]) == False
    
    def test_validate_red_balls_invalid_range(self):
        """测试红球范围错误"""
        assert validate_red_balls(["01", "03", "16", "18", "29", "34"]) == False
    
    def test_validate_blue_ball_valid(self):
        """测试有效的蓝球输入"""
        assert validate_blue_ball("06") == True
    
    def test_validate_blue_ball_invalid_range(self):
        """测试蓝球范围错误"""
        assert validate_blue_ball("17") == False
    
    def test_validate_blue_ball_invalid_format(self):
        """测试蓝球格式错误"""
        assert validate_blue_ball("abc") == False
    
    def test_validate_times_valid(self):
        """测试有效的期号"""
        assert validate_times("22065") == True
    
    def test_validate_times_invalid_length(self):
        """测试期号长度错误"""
        assert validate_times("2206") == False
    
    def test_validate_times_invalid_format(self):
        """测试期号格式错误"""
        assert validate_times("abcde") == False
    
    def test_validate_date_valid(self):
        """测试有效的日期"""
        assert validate_date("2022-06-09") == True
    
    def test_validate_date_invalid_length(self):
        """测试日期长度错误"""
        assert validate_date("2022-6-9") == False
    
    def test_validate_date_invalid_format(self):
        """测试日期格式错误"""
        assert validate_date("2022/06/09") == False