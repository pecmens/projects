from typing import Dict, List


class PrizeChecker:
    """中奖核对服务"""

    PRIZE_LEVELS = {
        (6, True): "一等奖",
        (6, False): "二等奖",
        (5, True): "三等奖",
        (5, False): "四等奖",
        (4, True): "四等奖",
        (4, False): "五等奖",
        (3, True): "五等奖",
        (0, True): "六等奖",
    }

    def check(self, user_numbers: Dict, lottery_record: Dict) -> str:
        """核对中奖"""
        user_red = set(user_numbers["red"])
        lottery_red = set(lottery_record["red_balls"])

        matched_red = len(user_red & lottery_red)
        matched_blue = user_numbers["blue"] == lottery_record["blue_ball"]

        key = (matched_red, matched_blue)
        return self.PRIZE_LEVELS.get(key, "未中奖")

    def batch_check(self, user_numbers: Dict, records: List[Dict]) -> Dict[str, int]:
        """批量核对"""
        results = {}
        for record in records:
            prize = self.check(user_numbers, record)
            results[prize] = results.get(prize, 0) + 1
        return results