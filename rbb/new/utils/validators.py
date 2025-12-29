from typing import List


def validate_red_balls(red_balls: List[str]) -> bool:
    """验证红球输入"""
    if len(red_balls) != 6:
        return False
    if len(set(red_balls)) != 6:
        return False
    for ball in red_balls:
        if not ball.isdigit() or not (1 <= int(ball) <= 33):
            return False
    return True


def validate_blue_ball(blue_ball: str) -> bool:
    """验证蓝球输入"""
    if not blue_ball.isdigit():
        return False
    return 1 <= int(blue_ball) <= 16


def validate_times(times: str) -> bool:
    """验证期号格式"""
    return times.isdigit() and len(times) == 5


def validate_date(date: str) -> bool:
    """验证日期格式 YYYY-MM-DD"""
    if len(date) != 10:
        return False
    parts = date.split("-")
    if len(parts) != 3:
        return False
    return all(part.isdigit() for part in parts)
