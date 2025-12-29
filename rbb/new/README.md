# 双色球历史开奖查询工具

一个功能完善的双色球历史开奖查询、中奖核对和统计分析工具，采用模块化设计，支持命令行交互。

## 项目简介

本项目是一个基于 Python 的双色球（Union Lotto）数据查询和分析工具，主要功能包括：

- **历史开奖查询**：按期号或日期查询开奖号码
- **中奖核对**：核对用户选号与开奖号码，判断中奖等级
- **统计分析**：红蓝球频率统计、热号/冷号分析、遗漏值分析
- **数据缓存**：支持 CSV 数据持久化和增量更新

## 项目特点

- **模块化架构**：采用三层架构设计（数据层、业务层、应用层）
- **数据持久化**：CSV 缓存机制，避免重复网络请求
- **增量更新**：支持增量更新最新开奖数据
- **类型安全**：使用 Python 类型提示
- **完整测试**：包含单元测试覆盖核心功能

## 项目结构

```
new/
├── README.md              # 项目说明文档
├── help.md                # 使用帮助文档
├── project.md             # 项目设计计划
├── requirements.txt       # 依赖包列表
├── config.py              # 配置管理
├── main.py                # 程序入口
├── cli.py                 # CLI 命令行接口
├── venv/                  # Python 虚拟环境
│
├── data/                  # 数据访问层
│   ├── __init__.py
│   ├── models.py          # 数据模型定义
│   ├── fetcher.py         # 网络数据抓取
│   ├── storage.py         # 数据持久化（CSV）
│   └── loader.py          # 数据加载
│
├── service/               # 业务逻辑层
│   ├── __init__.py
│   ├── query_service.py   # 查询服务
│   ├── prize_checker.py   # 中奖核对服务
│   └── statistics.py      # 统计分析服务
│
├── utils/                 # 工具模块
│   ├── __init__.py
│   └── validators.py      # 输入验证
│
├── tests/                 # 测试目录
│   ├── __init__.py
│   ├── test_prize_checker.py
│   └── test_validators.py
│
└── data_files/            # 数据文件目录
    └── ssq_data.csv       # 双色球历史数据缓存
```

## 环境要求

- Python 3.9+
- pip 包管理器

## 快速开始

### 1. 克隆项目

```bash
cd /home/pecmen/code/pon/rbb/new
```

### 2. 创建虚拟环境

```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows
```

### 3. 安装依赖

```bash
pip install -r requirements.txt
```

### 4. 运行程序

```bash
python main.py --help
```

## 使用方法

### 查询开奖号码

按期号查询：
```bash
python main.py query --by times --value 22065
```

按日期查询：
```bash
python main.py query --by date --value 2022-06-09
```

### 核对中奖

核对最新一期：
```bash
python main.py check --red 01 03 16 18 29 33 --blue 06
```

指定期号核对：
```bash
python main.py check --red 01 03 16 18 29 33 --blue 06 --times 22061
```

批量核对最近100期：
```bash
python main.py check --red 01 03 16 18 29 33 --blue 06 --batch
```

### 统计分析

频率统计：
```bash
python main.py stats --type freq --count 10
```

热号分析：
```bash
python main.py stats --type hot --count 6
```

冷号分析：
```bash
python main.py stats --type cold --count 6
```

遗漏分析：
```bash
python main.py stats --type missing
```

### 更新数据

全量更新：
```bash
python main.py update
```

增量更新：
```bash
python main.py update --incremental
```

## 命令参考

| 命令 | 说明 | 参数 |
|------|------|------|
| `query` | 查询开奖号码 | `--by` (times/date), `--value`, `--refresh` |
| `check` | 核对中奖 | `--red` (6个), `--blue`, `--times`, `--batch` |
| `stats` | 统计分析 | `--type` (freq/hot/cold/missing), `--count` |
| `update` | 更新数据 | `--incremental` |

详细使用说明请参考 [help.md](help.md)

## 技术架构

### 三层架构设计

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

### 核心模块说明

#### 数据层 (data/)

- **models.py**: 定义 `LotteryRecord` 数据模型
- **fetcher.py**: 从 500.com 抓取双色球历史数据
- **storage.py**: CSV 数据持久化
- **loader.py**: 数据加载和增量更新

#### 业务层 (service/)

- **query_service.py**: 提供查询接口（按期号/日期/范围）
- **prize_checker.py**: 中奖等级判定（6个等级）
- **statistics.py**: 统计分析（频率、热号、冷号、遗漏）

#### 工具层 (utils/)

- **validators.py**: 输入验证（红球、蓝球、期号、日期）

## 测试

运行单元测试：

```bash
pytest tests/
```

运行特定测试：

```bash
pytest tests/test_prize_checker.py
pytest tests/test_validators.py
```

查看测试覆盖率：

```bash
pytest tests/ --cov=. --cov-report=html
```

## 配置说明

配置文件位于 `config.py`，主要配置项：

```python
# 数据源
DATA_URL = "https://datachart.500.com/ssq/history/newinc/history.php"

# 存储路径
STORAGE_PATH = "data_files/ssq_data.csv"

# 业务配置
DEFAULT_RECENT_COUNT = 30  # 统计最近 N 期
HOT_NUMBERS_COUNT = 6      # 热号数量
COLD_NUMBERS_COUNT = 6     # 冷号数量
```

## 中奖规则

| 红球匹配 | 蓝球匹配 | 中奖等级 |
|---------|---------|---------|
| 6 | 是 | 一等奖 |
| 6 | 否 | 二等奖 |
| 5 | 是 | 三等奖 |
| 5 | 否 | 四等奖 |
| 4 | 是 | 四等奖 |
| 4 | 否 | 五等奖 |
| 3 | 是 | 五等奖 |
| 0 | 是 | 六等奖 |

## 数据来源

本工具的数据来源于 500彩票网（https://datachart.500.com），仅用于学习和研究目的。

## 注意事项

1. 本工具仅供学习和研究使用，不构成任何投资建议
2. 彩票具有随机性，历史数据不能预测未来结果
3. 请理性购彩，量力而行
4. 数据更新依赖于 500彩票网的可用性

## 后续扩展

- [ ] 数据库支持（SQLite/MySQL）
- [ ] Web 界面（Flask/FastAPI）
- [ ] 图表可视化（matplotlib/plotly）
- [ ] 定时任务自动更新
- [ ] 多彩种支持（大乐透等）
- [ ] 预测算法推荐

## 许可证

本项目仅供学习和研究使用。

## 联系方式

如有问题或建议，欢迎反馈。

---

*最后更新: 2025-12-28*