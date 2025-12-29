#!/usr/bin/env python3
"""
双色球历史开奖查询工具
主程序入口
"""

import sys

from cli import main

if __name__ == "__main__":
    sys.exit(main() or 0)
