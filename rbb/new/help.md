# 双色球历史开奖查询工具 - 使用帮助

## 目录

- [快速开始](#快速开始)
- [命令详解](#命令详解)
- [使用示例](#使用示例)
- [常见问题](#常见问题)
- [中奖规则](#中奖规则)

---

## 快速开始

### 1. 激活虚拟环境

```bash
cd /home/pecmen/code/pon/rbb/new
source venv/bin/activate
```

### 2. 查看帮助

```bash
python main.py --help
```

### 3. 首次使用（更新数据）

```bash
python main.py update
```

---

## 命令详解

### query - 查询开奖号码

按期号或日期查询历史开奖号码。

#### 语法

```bash
python main.py query --by <方式> --value <值> [--refresh]
```

#### 参数说明

| 参数 | 必需 | 说明 | 可选值 |
|------|------|------|--------|
| `--by` | 是 | 查询方式 | `times`（期号）或 `date`（日期） |
| `--value` | 是 | 查询值 | 期号（如 22065）或日期（如 2022-06-09） |
| `--refresh` | 否 | 强制刷新数据 | 无 |

#### 示例

按期号查询：
```bash
python main.py query --by times --value 22065
```

按日期查询：
```bash
python main.py query --by date --value 2022-06-09
```

强制刷新后查询：
```bash
python main.py query --by times --value 22065 --refresh
```

---

### check - 核对中奖

核对用户选号与开奖号码，判断中奖等级。

#### 语法

```bash
python main.py check --red <红球1> <红球2> <红球3> <红球4> <红球5> <红球6> --blue <蓝球> [--times <期号>] [--batch]
```

#### 参数说明

| 参数 | 必需 | 说明 |
|------|------|------|
| `--red` | 是 | 6个红球号码（01-33） |
| `--blue` | 是 | 1个蓝球号码（01-16） |
| `--times` | 否 | 指定期号核对（默认最新一期） |
| `--batch` | 否 | 批量核对最近100期 |

#### 示例

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

---

### stats - 统计分析

对历史开奖数据进行统计分析。

#### 语法

```bash
python main.py stats --type <类型> [--count <数量>]
```

#### 参数说明

| 参数 | 必需 | 说明 | 可选值 |
|------|------|------|--------|
| `--type` | 否 | 统计类型 | `freq`（频率）、`hot`（热号）、`cold`（冷号）、`missing`（遗漏） |
| `--count` | 否 | 显示数量 | 默认 10 |

#### 统计类型说明

- **freq**：红蓝球出现频率统计
- **hot**：高频号码（热号）
- **cold**：低频号码（冷号）
- **missing**：最近N期未出现的号码（遗漏值）

#### 示例

红蓝球频率统计（显示前10个）：
```bash
python main.py stats --type freq --count 10
```

获取热号（高频号码）：
```bash
python main.py stats --type hot --count 6
```

获取冷号（低频号码）：
```bash
python main.py stats --type cold --count 6
```

分析遗漏值（最近30期未出现的号码）：
```bash
python main.py stats --type missing
```

---

### update - 更新数据

更新本地数据缓存。

#### 语法

```bash
python main.py update [--incremental]
```

#### 参数说明

| 参数 | 必需 | 说明 |
|------|------|------|
| `--incremental` | 否 | 增量更新（仅更新最新数据） |

#### 示例

全量更新（重新抓取所有数据）：
```bash
python main.py update
```

增量更新（仅更新最新数据）：
```bash
python main.py update --incremental
```

---

## 使用示例

### 场景 1：查询最新一期开奖号码

```bash
# 先更新数据
python main.py update --incremental

# 查询最新一期（假设是 22065）
python main.py query --by times --value 22065
```

输出示例：
```
期号: 22065
日期: 2022-06-09
红球: 09 - 14 - 18 - 23 - 28 - 31
蓝球: 02
```

### 场景 2：核对是否中奖

```bash
# 核对最新一期
python main.py check --red 09 14 18 23 28 31 --blue 02
```

输出示例：
```
期号: 22065
开奖号码: 09 - 14 - 18 - 23 - 28 - 31 / 02
您的号码: 09 - 14 - 18 - 23 - 28 - 31 / 02
中奖等级: 一等奖
```

### 场景 3：分析历史数据

```bash
# 查看红蓝球出现频率
python main.py stats --type freq --count 10
```

输出示例：
```
红球频率统计:
  07: 523次
  14: 518次
  01: 515次
  ...

蓝球频率统计:
  12: 156次
  06: 154次
  09: 152次
  ...
```

### 场景 4：获取选号参考

```bash
# 查看热号（高频号码）
python main.py stats --type hot --count 6

# 查看冷号（低频号码）
python main.py stats --type cold --count 6

# 查看遗漏值
python main.py stats --type missing
```

### 场景 5：批量核对历史数据

```bash
# 查看某组号码在最近100期中的中奖情况
python main.py check --red 01 03 16 18 29 33 --blue 06 --batch
```

输出示例：
```
批量核对结果（最近100期）：
  一等奖: 0次
  二等奖: 0次
  三等奖: 1次
  四等奖: 2次
  五等奖: 5次
  六等奖: 12次
  未中奖: 80次
```

---

## 常见问题

### Q1: 首次使用需要做什么？

首次使用需要先更新数据：

```bash
python main.py update
```

这会从 500彩票网抓取历史数据并保存到本地 CSV 文件中。

### Q2: 如何获取最新开奖数据？

使用增量更新：

```bash
python main.py update --incremental
```

这只会抓取最新的开奖数据，速度更快。

### Q3: 数据存储在哪里？

数据存储在 `data_files/ssq_data.csv` 文件中。

### Q4: 如何查看所有可用命令？

```bash
python main.py --help
```

或查看特定命令的帮助：

```bash
python main.py query --help
python main.py check --help
python main.py stats --help
python main.py update --help
```

### Q5: 红球和蓝球的号码范围是什么？

- 红球：01-33，共6个，不重复
- 蓝球：01-16，共1个

### Q6: 输入号码需要补零吗？

建议补零（如 01 而不是 1），但程序也支持不补零的输入。

### Q7: 为什么查询不到结果？

可能的原因：
1. 期号或日期格式错误
2. 该期号或日期不存在
3. 数据未更新

解决方法：
1. 检查输入格式（期号5位数字，日期格式 YYYY-MM-DD）
2. 运行 `python main.py update` 更新数据

### Q8: 如何运行测试？

```bash
pytest tests/
```

### Q9: 如何退出虚拟环境？

```bash
deactivate
```

### Q10: 程序支持哪些平台？

支持 Linux、macOS 和 Windows 平台。

---

## 中奖规则

### 双色球玩法规则

- **红球**：从 01-33 中选择 6 个号码（不重复）
- **蓝球**：从 01-16 中选择 1 个号码

### 中奖等级

| 红球匹配数 | 蓝球匹配 | 中奖等级 | 奖金说明 |
|-----------|---------|---------|---------|
| 6 | 是 | 一等奖 | 当期奖金总额的 70% |
| 6 | 否 | 二等奖 | 当期奖金总额的 25% |
| 5 | 是 | 三等奖 | 单注奖金固定为 3000 元 |
| 5 | 否 | 四等奖 | 单注奖金固定为 200 元 |
| 4 | 是 | 四等奖 | 单注奖金固定为 200 元 |
| 4 | 否 | 五等奖 | 单注奖金固定为 10 元 |
| 3 | 是 | 五等奖 | 单注奖金固定为 10 元 |
| 0 | 是 | 六等奖 | 单注奖金固定为 5 元 |

### 示例说明

**一等奖**：红球6个全中，蓝球也中
```
开奖: 01 03 16 18 29 33 + 06
选号: 01 03 16 18 29 33 + 06
```

**二等奖**：红球6个全中，蓝球没中
```
开奖: 01 03 16 18 29 33 + 06
选号: 01 03 16 18 29 33 + 05
```

**三等奖**：红球中5个，蓝球也中
```
开奖: 01 03 16 18 29 33 + 06
选号: 01 03 16 18 29 05 + 06
```

**六等奖**：红球全没中，蓝球中
```
开奖: 01 03 16 18 29 33 + 06
选号: 02 04 06 08 10 12 + 06
```

---

## 技巧与建议

### 1. 定期更新数据

建议每周运行一次增量更新，确保数据最新：

```bash
python main.py update --incremental
```

### 2. 利用统计分析

- **热号**：近期出现频率高的号码
- **冷号**：近期出现频率低的号码
- **遗漏值**：长期未出现的号码

可以结合多种分析方法作为选号参考。

### 3. 批量核对历史数据

使用 `--batch` 参数可以查看某组号码在历史中的表现：

```bash
python main.py check --red 01 03 16 18 29 33 --blue 06 --batch
```

### 4. 组合查询

可以先查询开奖号码，再核对：

```bash
# 查询某期开奖
python main.py query --by times --value 22065

# 核对是否中奖
python main.py check --red 09 14 18 23 28 31 --blue 02 --times 22065
```

---

## 免责声明

本工具仅供学习和研究使用，数据来源于 500彩票网。彩票具有随机性，历史数据不能预测未来结果。请理性购彩，量力而行。

---

*最后更新: 2025-12-28*