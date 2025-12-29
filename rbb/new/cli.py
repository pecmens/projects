import argparse

from config import Config
from data.fetcher import DataFetcher
from data.loader import DataLoader
from data.storage import CSVStorage
from service.prize_checker import PrizeChecker
from service.query_service import QueryService
from service.statistics import StatisticsService


class CLI:
    """命令行接口"""

    def __init__(self):
        self.config = Config()
        self.config.ensure_dirs()

        # 初始化组件
        fetcher = DataFetcher(self.config.DATA_URL)
        storage = CSVStorage(str(self.config.STORAGE_PATH))
        self.loader = DataLoader(fetcher, storage)

    def run(self):
        """运行 CLI"""
        parser = argparse.ArgumentParser(
            description="双色球历史开奖查询工具",
            formatter_class=argparse.RawDescriptionHelpFormatter,
            epilog="""
示例:
  python cli.py query --by times --value 22065
  python cli.py query --by date --value 2022-06-09
  python cli.py check --red 01 03 16 18 29 33 --blue 06
  python cli.py check --red 01 03 16 18 29 33 --blue 06 --batch
  python cli.py stats --type freq --count 10
  python cli.py update --incremental
            """,
        )
        subparsers = parser.add_subparsers(dest="command", help="可用命令")

        # 查询命令
        query_parser = subparsers.add_parser("query", help="查询开奖号码")
        query_parser.add_argument(
            "--by", choices=["times", "date"], required=True, help="查询方式：期号或日期"
        )
        query_parser.add_argument("--value", required=True, help="查询值")
        query_parser.add_argument("--refresh", action="store_true", help="强制刷新数据")

        # 核对命令
        check_parser = subparsers.add_parser("check", help="核对中奖")
        check_parser.add_argument("--red", nargs=6, required=True, help="红球号码（6个）")
        check_parser.add_argument("--blue", required=True, help="蓝球号码")
        check_parser.add_argument("--times", help="指定期号核对")
        check_parser.add_argument("--batch", action="store_true", help="批量核对最近100期")

        # 统计命令
        stats_parser = subparsers.add_parser("stats", help="统计分析")
        stats_parser.add_argument(
            "--type", choices=["freq", "hot", "cold", "missing"], default="freq", help="统计类型"
        )
        stats_parser.add_argument("--count", type=int, default=10, help="显示数量")

        # 更新命令
        update_parser = subparsers.add_parser("update", help="更新数据")
        update_parser.add_argument("--incremental", action="store_true", help="增量更新")

        args = parser.parse_args()

        if not args.command:
            parser.print_help()
            return

        # 执行命令
        if args.command == "query":
            self._handle_query(args)
        elif args.command == "check":
            self._handle_check(args)
        elif args.command == "stats":
            self._handle_stats(args)
        elif args.command == "update":
            self._handle_update(args)

    def _handle_query(self, args):
        """处理查询命令"""
        records = self.loader.load(force_refresh=args.refresh)
        query_service = QueryService(records)

        if args.by == "times":
            result = query_service.query_by_times(args.value)
            if result:
                print(f"期号: {result.times}")
                print(f"日期: {result.date}")
                print(f"红球: {' - '.join(result.red_balls)}")
                print(f"蓝球: {result.blue_ball}")
            else:
                print(f"未找到期号 {args.value}")

        elif args.by == "date":
            result = query_service.query_by_date(args.value)
            if result:
                print(f"日期: {result.date}")
                print(f"期号: {result.times}")
                print(f"红球: {' - '.join(result.red_balls)}")
                print(f"蓝球: {result.blue_ball}")
            else:
                print(f"未找到日期 {args.value}")

    def _handle_check(self, args):
        """处理核对命令"""
        records = self.loader.load()
        prize_checker = PrizeChecker()
        user_numbers = {"red": args.red, "blue": args.blue}

        if args.batch:
            # 批量核对最近100期
            recent_records = records[:100]
            results = prize_checker.batch_check(user_numbers, recent_records)
            print("批量核对结果（最近100期）：")
            for level, count in results.items():
                print(f"  {level}: {count}次")
        else:
            # 单期核对
            if args.times:
                query_service = QueryService(records)
                record = query_service.query_by_times(args.times)
                if not record:
                    print(f"未找到期号 {args.times}")
                    return
            else:
                record = records[0]  # 最新一期

            # 转换为字典格式
            record_dict = {
                "red_balls": record.red_balls,
                "blue_ball": record.blue_ball,
            }
            prize = prize_checker.check(user_numbers, record_dict)
            print(f"期号: {record.times}")
            print(f"开奖号码: {' - '.join(record.red_balls)} / {record.blue_ball}")
            print(f"您的号码: {' - '.join(args.red)} / {args.blue}")
            print(f"中奖等级: {prize}")

    def _handle_stats(self, args):
        """处理统计命令"""
        records = self.loader.load()
        # 转换为字典列表格式
        records_dict = [r.to_dict() for r in records]
        stats_service = StatisticsService(records_dict)

        if args.type == "freq":
            print("红球频率统计:")
            red_freq = stats_service.red_ball_frequency(args.count)
            for num, count in red_freq:
                print(f"  {num}: {count}次")

            print("\n蓝球频率统计:")
            blue_freq = stats_service.blue_ball_frequency(args.count)
            for num, count in blue_freq:
                print(f"  {num}: {count}次")

        elif args.type == "hot":
            hot_nums = stats_service.get_hot_numbers(args.count, 3)
            print(f"热号（高频）:")
            print(f"  红球: {' - '.join(hot_nums['red'])}")
            print(f"  蓝球: {' - '.join(hot_nums['blue'])}")

        elif args.type == "cold":
            cold_nums = stats_service.get_cold_numbers(args.count, 3)
            print(f"冷号（低频）:")
            print(f"  红球: {' - '.join(cold_nums['red'])}")
            print(f"  蓝球: {' - '.join(cold_nums['blue'])}")

        elif args.type == "missing":
            missing = stats_service.analyze_missing()
            print(f"遗漏值（最近30期未出现）:")
            print(f"  红球: {', '.join(missing['red'].keys())}")
            print(f"  蓝球: {', '.join(missing['blue'].keys())}")

    def _handle_update(self, args):
        """处理更新命令"""
        if args.incremental:
            print("执行增量更新...")
            records = self.loader.update_incremental()
            print(f"更新完成，共 {len(records)} 条记录")
        else:
            print("执行全量更新...")
            records = self.loader.load(force_refresh=True)
            print(f"更新完成，共 {len(records)} 条记录")


def main():
    cli = CLI()
    cli.run()


if __name__ == "__main__":
    main()
