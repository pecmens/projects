from typing import Dict, List, Union
from data.models import LotteryRecord
from common.prize_checker import PrizeChecker as BasePrizeChecker


class PrizeChecker(BasePrizeChecker):
    """中奖核对服务（继承共享模块）"""

    def check(
        self, user_numbers: Dict[str, Union[List[str], str]], lottery_record
    ) -> str:
        """
        核对中奖情况

        Args:
            user_numbers: 用户选号 {'red': List[str], 'blue': str}
            lottery_record: 开奖记录（LotteryRecord 对象或字典）

        Returns:
            str: 中奖等级
        """
        if isinstance(lottery_record, LotteryRecord):
            record_dict = lottery_record.to_dict()
        else:
            record_dict = lottery_record
        return super().check(user_numbers, record_dict)

    def batch_check(
        self, user_numbers: Dict[str, Union[List[str], str]], records: List[LotteryRecord]
    ) -> Dict[str, int]:
        """批量核对（统计各等级中奖次数）"""
        records_dict = [r.to_dict() for r in records]
        return super().batch_check(user_numbers, records_dict)
