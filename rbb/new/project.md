# 双色球应用新版本设计计划

## 一、项目概述

### 1.1 项目目标
基于现有 old/ 目录下的代码，重构并优化双色球历史开奖查询应用，实现数据持久化、模块化设计、增强功能扩展性。

### 1.2 核心功能
- 数据抓取与持久化（CSV 缓存 + 增量更新）
- 开奖号码查询（按期号/日期）
- 中奖等级核对
- 统计分析（频率、趋势、冷热号）
- CLI 命令行交互界面

### 1.3 技术栈
- **Python**: 3.9+
- **网络请求**: requests
- **HTML 解析**: BeautifulSoup4
- **数据处理**: pandas
- **CLI 框架**: argparse (标准库)
- **类型提示**: typing
- **测试**: pytest

---

## 二、架构设计

### 2.1 目录结构

```
new/
├── project.md                 # 本文件
├── README.md                  # 项目说明文档
├── requirements.txt           # 依赖包列表
├── config.py                  # 配置管理
├── main.py                    # 程序入口
├── cli.py                     # CLI 命令行接口
│
├── data/                      # 数据访问层
│   ├── __init__.py
│   ├── fetcher.py            # 网络数据抓取
│   ├── storage.py            # 数据持久化（CSV）
│   ├── loader.py             # 数据加载
│   └── models.py             # 数据模型定义
│
├── service/                   # 业务逻辑层
│   ├── __init__.py
│   ├── query_service.py      # 查询服务
│   ├── prize_checker.py      # 中奖核对服务
│   └── statistics.py         # 统计分析服务
│
├── utils/                     # 工具模块
│   ├── __init__.py
│   ├── logger.py             # 日志工具
│   └── validators.py         # 输入验证
│
├── tests/                     # 测试目录
│   ├── __init__.py
│   ├── test_fetcher.py
│   ├── test_prize_checker.py
│   └── test_statistics.py
│
└── data_files/                # 数据文件目录
    └── ssq_data.csv          # 双色球历史数据缓存
```

### 2.2 架构分层

```
┌─────────────────────────────────────┐
│         应用层 (CLI)                 │
│  - 命令行参数解析                    │
│  - 用户交互                          │
│  - 结果展示                          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      业务逻辑层 (service/)           │
│  - LotteryQueryService              │
│  - PrizeCheckService                │
│  - StatisticsService                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      数据访问层 (data/)              │
│  - DataFetcher (网络爬虫)           │
│  - CSVStorage (数据持久化)          │
│  - DataLoader (数据加载)            │
└─────────────────────────────────────┘
```

---

## 三、核心模块设计

### 3.1 数据访问层 (data/)

#### 3.1.1 models.py - 数据模型

```python
from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class LotteryRecord:
    """双色球开奖记录"""
    times: str           # 期号，如 "22065"
    red_balls: List[str] # 红球列表，如 ["09", "14", "18", "23", "28", "31"]
    blue_ball: str       # 蓝球，如 "02"
    date: str            # 开奖日期，如 "2022-06-09"
    
    def to_dict(self) -> dict:
        """转换为字典格式（用于 CSV 存储）"""
        return {
            'times': self.times,
            'rb1': self.red_balls[0],
            'rb2': self.red_balls[1],
            'rb3': self.red_balls[2],
            'rb4': self.red_balls[3],
            'rb5': self.red_balls[4],
            'rb6': self.red_balls[5],
            'bb': self.blue_ball,
            'dates': self.date
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'LotteryRecord':
        """从字典创建实例"""
        return cls(
            times=data['times'],
            red_balls=[data[f'rb{i}'] for i in range(1, 7)],
            blue_ball=data['bb'],
            date=data['dates']
        )
```

#### 3.1.2 fetcher.py - 数据抓取

```python
import requests
from bs4 import BeautifulSoup
from typing import List, Optional
from .models import LotteryRecord

class DataFetcher:
    """双色球数据抓取器"""
    
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0'
        }
    
    def fetch(self, start: int = 1, end: Optional[int] = None) -> List[LotteryRecord]:
        """
        抓取双色球历史数据
        
        Args:
            start: 起始期号
            end: 结束期号（可选，默认抓取全部）
            
        Returns:
            List[LotteryRecord]: 开奖记录列表
        """
        url = f"{self.base_url}?start={start:05d}"
        if end:
            url += f"&end={end:05d}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.encoding = 'UTF-8'
            html = response.text
            return self._parse_html(html)
        except Exception as e:
            raise Exception(f"数据抓取失败: {e}")
    
    def _parse_html(self, html: str) -> List[LotteryRecord]:
        """解析 HTML 提取开奖数据"""
        soup = BeautifulSoup(html, "html5lib")
        table = soup.find_all('table')[2]
        rows = table.find_all('tr')[2:]  # 跳过表头
        
        records = []
        for row in rows:
            cells = row.find_all('td')
            if len(cells) >= 16:
                times = cells[0].text
                red_balls = [cells[i].text for i in range(1, 7)]
                blue_ball = cells[7].text
                date = cells[15].text
                records.append(LotteryRecord(times, red_balls, blue_ball, date))
        
        return records
```

#### 3.1.3 storage.py - 数据持久化

```python
import csv
from pathlib import Path
from typing import List, Optional
from .models import LotteryRecord

class CSVStorage:
    """CSV 数据存储"""
    
    def __init__(self, filepath: str):
        self.filepath = Path(filepath)
        self.headers = ['times', 'rb1', 'rb2', 'rb3', 'rb4', 'rb5', 'rb6', 'bb', 'dates']
    
    def save(self, records: List[LotteryRecord], mode: str = 'w'):
        """
        保存数据到 CSV
        
        Args:
            records: 开奖记录列表
            mode: 写入模式，'w' 覆盖，'a' 追加
        """
        self.filepath.parent.mkdir(parents=True, exist_ok=True)
        
        with open(self.filepath, mode, encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, self.headers)
            if mode == 'w' or not self.filepath.exists():
                writer.writeheader()
            for record in records:
                writer.writerow(record.to_dict())
    
    def load(self) -> List[LotteryRecord]:
        """从 CSV 加载数据"""
        if not self.filepath.exists():
            return []
        
        records = []
        with open(self.filepath, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                records.append(LotteryRecord.from_dict(row))
        return records
    
    def get_latest_times(self) -> Optional[int]:
        """获取最新期号"""
        records = self.load()
        if not records:
            return None
        return int(records[0].times)
```

#### 3.1.4 loader.py - 数据加载

```python
from typing import List, Optional
from .fetcher import DataFetcher
from .storage import CSVStorage
from .models import LotteryRecord

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
```

---

### 3.2 业务逻辑层 (service/)

#### 3.2.1 query_service.py - 查询服务

```python
from typing import List, Optional, Dict
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
```

#### 3.2.2 prize_checker.py - 中奖核对

```python
from typing import List, Dict
from data.models import LotteryRecord

class PrizeChecker:
    """中奖核对服务（复用 rdb-g1.py 的判定逻辑）"""
    
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
    
    def check(self, user_numbers: Dict, lottery_record: LotteryRecord) -> str:
        """
        核对中奖情况
        
        Args:
            user_numbers: 用户选号 {'red': List[str], 'blue': str}
            lottery_record: 开奖记录
            
        Returns:
            str: 中奖等级
        """
        user_red = set(user_numbers['red'])
        lottery_red = set(lottery_record.red_balls)
        
        matched_red = len(user_red & lottery_red)
        matched_blue = user_numbers['blue'] == lottery_record.blue_ball
        
        key = (matched_red, matched_blue)
        return self.PRIZE_LEVELS.get(key, "未中奖")
    
    def batch_check(self, user_numbers: Dict, records: List[LotteryRecord]) -> Dict[str, int]:
        """批量核对（统计各等级中奖次数）"""
        results = {}
        for record in records:
            prize = self.check(user_numbers, record)
            results[prize] = results.get(prize, 0) + 1
        return results
```

#### 3.2.3 statistics.py - 统计分析

```python
from typing import Dict, List, Tuple
from collections import Counter
from data.models import LotteryRecord

class StatisticsService:
    """统计分析服务"""
    
    def __init__(self, records: List[LotteryRecord]):
        self.records = records
    
    def red_ball_frequency(self, top_n: int = 33) -> List[Tuple[str, int]]:
        """红球出现频率统计"""
        all_reds = [ball for record in self.records for ball in record.red_balls]
        counter = Counter(all_reds)
        return counter.most_common(top_n)
    
    def blue_ball_frequency(self, top_n: int = 16) -> List[Tuple[str, int]]:
        """蓝球出现频率统计"""
        all_blues = [record.blue_ball for record in self.records]
        counter = Counter(all_blues)
        return counter.most_common(top_n)
    
    def get_hot_numbers(self, red_count: int = 6, blue_count: int = 3) -> Dict[str, List[str]]:
        """获取热号（高频号码）"""
        hot_reds = [num for num, _ in self.red_ball_frequency(red_count)]
        hot_blues = [num for num, _ in self.blue_ball_frequency(blue_count)]
        return {'red': hot_reds, 'blue': hot_blues}
    
    def get_cold_numbers(self, red_count: int = 6, blue_count: int = 3) -> Dict[str, List[str]]:
        """获取冷号（低频号码）"""
        cold_reds = [num for num, _ in self.red_ball_frequency()[-red_count:]]
        cold_blues = [num for num, _ in self.blue_ball_frequency()[-blue_count:]]
        return {'red': cold_reds, 'blue': cold_blues}
    
    def analyze_missing(self, recent_n: int = 30) -> Dict[str, Dict[str, int]]:
        """分析遗漏值（最近 N 期未出现的号码）"""
        recent_records = self.records[:recent_n]
        
        red_set = {str(i).zfill(2) for i in range(1, 34)}
        blue_set = {str(i).zfill(2) for i in range(1, 17)}
        
        recent_reds = {ball for r in recent_records for ball in r.red_balls}
        recent_blues = {r.blue_ball for r in recent_records}
        
        missing_reds = red_set - recent_reds
        missing_blues = blue_set - recent_blues
        
        return {
            'red': {num: recent_n for num in missing_reds},
            'blue': {num: recent_n for num in missing_blues}
        }
```

---

### 3.3 工具模块 (utils/)

#### 3.3.1 logger.py - 日志工具

```python
import logging
from pathlib import Path

def setup_logger(name: str = "ssq", log_file: str = "ssq.log"):
    """配置日志"""
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # 控制台处理器
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    
    # 文件处理器
    file_handler = logging.FileHandler(log_file, encoding='utf-8')
    file_handler.setLevel(logging.DEBUG)
    
    # 格式化
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)
    
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    
    return logger
```

#### 3.3.2 validators.py - 输入验证

```python
from typing import List, Optional

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
    parts = date.split('-')
    if len(parts) != 3:
        return False
    return all(part.isdigit() for part in parts)
```

---

### 3.4 配置管理 (config.py)

```python
from pathlib import Path

class Config:
    """配置管理"""
    
    # 数据源
    DATA_URL = "https://datachart.500.com/ssq/history/newinc/history.php"
    
    # 存储路径
    PROJECT_ROOT = Path(__file__).parent
    DATA_DIR = PROJECT_ROOT / "data_files"
    STORAGE_PATH = DATA_DIR / "ssq_data.csv"
    LOG_FILE = PROJECT_ROOT / "ssq.log"
    
    # 请求配置
    REQUEST_TIMEOUT = 30
    REQUEST_INTERVAL = 1  # 秒
    
    # 业务配置
    DEFAULT_RECENT_COUNT = 30  # 统计最近 N 期
    HOT_NUMBERS_COUNT = 6      # 热号数量
    COLD_NUMBERS_COUNT = 6     # 冷号数量
    
    @classmethod
    def ensure_dirs(cls):
        """确保目录存在"""
        cls.DATA_DIR.mkdir(parents=True, exist_ok=True)
```

---

### 3.5 CLI 接口 (cli.py)

```python
import argparse
from typing import Optional
from data.loader import DataLoader
from data.fetcher import DataFetcher
from data.storage import CSVStorage
from service.query_service import QueryService
from service.prize_checker import PrizeChecker
from service.statistics import StatisticsService
from config import Config
from utils.validators import validate_red_balls, validate_blue_ball

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
        parser = argparse.ArgumentParser(description='双色球历史开奖查询工具')
        subparsers = parser.add_subparsers(dest='command', help='可用命令')
        
        # 查询命令
        query_parser = subparsers.add_parser('query', help='查询开奖号码')
        query_parser.add_argument('--by', choices=['times', 'date'], required=True,
                                 help='查询方式：期号或日期')
        query_parser.add_argument('--value', required=True, help='查询值')
        query_parser.add_argument('--refresh', action='store_true',
                                 help='强制刷新数据')
        
        # 核对命令
        check_parser = subparsers.add_parser('check', help='核对中奖')
        check_parser.add_argument('--red', nargs=6, required=True,
                                 help='红球号码（6个）')
        check_parser.add_argument('--blue', required=True, help='蓝球号码')
        check_parser.add_argument('--times', help='指定期号核对')
        check_parser.add_argument('--batch', action='store_true',
                                 help='批量核对最近100期')
        
        # 统计命令
        stats_parser = subparsers.add_parser('stats', help='统计分析')
        stats_parser.add_argument('--type', choices=['freq', 'hot', 'cold', 'missing'],
                                 default='freq', help='统计类型')
        stats_parser.add_argument('--count', type=int, default=10,
                                 help='显示数量')
        
        # 更新命令
        update_parser = subparsers.add_parser('update', help='更新数据')
        update_parser.add_argument('--incremental', action='store_true',
                                  help='增量更新')
        
        args = parser.parse_args()
        
        if not args.command:
            parser.print_help()
            return
        
        # 执行命令
        if args.command == 'query':
            self._handle_query(args)
        elif args.command == 'check':
            self._handle_check(args)
        elif args.command == 'stats':
            self._handle_stats(args)
        elif args.command == 'update':
            self._handle_update(args)
    
    def _handle_query(self, args):
        """处理查询命令"""
        records = self.loader.load(force_refresh=args.refresh)
        query_service = QueryService(records)
        
        if args.by == 'times':
            result = query_service.query_by_times(args.value)
            if result:
                print(f"期号: {result.times}")
                print(f"日期: {result.date}")
                print(f"红球: {' - '.join(result.red_balls)}")
                print(f"蓝球: {result.blue_ball}")
            else:
                print(f"未找到期号 {args.value}")
        
        elif args.by == 'date':
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
        user_numbers = {'red': args.red, 'blue': args.blue}
        
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
            
            prize = prize_checker.check(user_numbers, record)
            print(f"期号: {record.times}")
            print(f"开奖号码: {' - '.join(record.red_balls)} / {record.blue_ball}")
            print(f"您的号码: {' - '.join(args.red)} / {args.blue}")
            print(f"中奖等级: {prize}")
    
    def _handle_stats(self, args):
        """处理统计命令"""
        records = self.loader.load()
        stats_service = StatisticsService(records)
        
        if args.type == 'freq':
            print("红球频率统计:")
            red_freq = stats_service.red_ball_frequency(args.count)
            for num, count in red_freq:
                print(f"  {num}: {count}次")
            
            print("\n蓝球频率统计:")
            blue_freq = stats_service.blue_ball_frequency(args.count)
            for num, count in blue_freq:
                print(f"  {num}: {count}次")
        
        elif args.type == 'hot':
            hot_nums = stats_service.get_hot_numbers(args.count, 3)
            print(f"热号（高频）:")
            print(f"  红球: {' - '.join(hot_nums['red'])}")
            print(f"  蓝球: {' - '.join(hot_nums['blue'])}")
        
        elif args.type == 'cold':
            cold_nums = stats_service.get_cold_numbers(args.count, 3)
            print(f"冷号（低频）:")
            print(f"  红球: {' - '.join(cold_nums['red'])}")
            print(f"  蓝球: {' - '.join(cold_nums['blue'])}")
        
        elif args.type == 'missing':
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

if __name__ == '__main__':
    main()
```

---

## 四、实现计划

### 4.1 阶段划分

| 阶段 | 任务 | 优先级 |
|------|------|--------|
| **P0** | 数据层实现（fetcher, storage, loader, models） | 高 |
| **P0** | 业务层实现（query_service, prize_checker） | 高 |
| **P0** | CLI 基础功能（query, check, update） | 高 |
| **P1** | 统计分析服务（statistics） | 中 |
| **P1** | CLI 高级功能（stats） | 中 |
| **P1** | 工具模块（logger, validators） | 中 |
| **P2** | 单元测试 | 中 |
| **P2** | README 文档 | 低 |

### 4.2 实施步骤

1. **Step 1**: 创建目录结构
2. **Step 2**: 实现数据模型（models.py）
3. **Step 3**: 实现数据抓取（fetcher.py）
4. **Step 4**: 实现数据持久化（storage.py）
5. **Step 5**: 实现数据加载（loader.py）
6. **Step 6**: 实现查询服务（query_service.py）
7. **Step 7**: 实现中奖核对（prize_checker.py）
8. **Step 8**: 实现统计分析（statistics.py）
9. **Step 9**: 实现 CLI 接口（cli.py）
10. **Step 10**: 编写测试用例
11. **Step 11**: 编写 README 文档

---

## 五、依赖清单

### requirements.txt

```
requests>=2.27.0
beautifulsoup4>=4.11.0
html5lib>=1.1
pandas>=1.5.0
pytest>=7.0.0
```

---

## 六、使用示例

### 安装依赖

```bash
pip install -r requirements.txt
```

### 查询开奖号码

```bash
# 按期号查询
python cli.py query --by times --value 22065

# 按日期查询
python cli.py query --by date --value 2022-06-09
```

### 核对中奖

```bash
# 核对最新一期
python cli.py check --red 01 03 16 18 29 33 --blue 06

# 指定期号核对
python cli.py check --red 01 03 16 18 29 33 --blue 06 --times 22061

# 批量核对最近100期
python cli.py check --red 01 03 16 18 29 33 --blue 06 --batch
```

### 统计分析

```bash
# 频率统计
python cli.py stats --type freq --count 10

# 热号分析
python cli.py stats --type hot --count 6

# 冷号分析
python cli.py stats --type cold --count 6

# 遗漏分析
python cli.py stats --type missing
```

### 更新数据

```bash
# 全量更新
python cli.py update

# 增量更新
python cli.py update --incremental
```

---

## 七、改进点总结

| 方面 | 现状 | 改进 |
|------|------|------|
| 数据持久化 | 每次重新抓取 | CSV 缓存 + 增量更新 |
| 代码组织 | 单文件混乱 | 模块化分层设计 |
| 代码复用 | 大量重复代码 | 统一服务层封装 |
| 错误处理 | 简单 try-except | 统一异常处理 + 日志 |
| 类型安全 | 无类型注解 | 添加类型提示 |
| 扩展性 | 硬编码 | 配置化 + 插件化 |
| 测试 | 无测试文件 | 添加单元测试 |
| 文档 | 简单说明 | 完整使用文档 |

---

## 八、后续扩展

1. **数据库支持**: SQLite / MySQL 存储替代 CSV
2. **Web 界面**: Flask / FastAPI 提供 REST API
3. **预测算法**: 基于历史数据的号码推荐
4. **图表可视化**: 生成统计图表（热力图、趋势图）
5. **定时任务**: 自动更新最新开奖数据
6. **多彩种支持**: 扩展支持大乐透等其他彩种

---

*文档版本: v1.0*  
*创建日期: 2025-12-28*