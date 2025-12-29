import logging
import requests
from bs4 import BeautifulSoup
from typing import List, Dict

logger = logging.getLogger(__name__)


class DataFetcher:
    """数据抓取器"""

    def __init__(self, base_url: str):
        self.base_url = base_url
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0"
        }

    def fetch(self, start: int = 1, end: int = None) -> List[Dict]:
        """抓取双色球历史数据"""
        url = f"{self.base_url}?start={start:05d}"
        if end:
            url += f"&end={end:05d}"

        logger.info(f"开始抓取数据: {url}")

        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            response.encoding = "UTF-8"
            html = response.text
            records = self._parse_html(html)
            logger.info(f"成功抓取 {len(records)} 条记录")
            return records
        except requests.exceptions.Timeout:
            logger.error(f"请求超时: {url}")
            raise Exception("请求超时，请检查网络连接")
        except requests.exceptions.RequestException as e:
            logger.error(f"网络请求失败: {e}")
            raise Exception(f"网络请求失败: {e}")
        except Exception as e:
            logger.error(f"数据抓取失败: {e}")
            raise Exception(f"数据抓取失败: {e}")

    def _parse_html(self, html: str) -> List[Dict]:
        """解析 HTML"""
        soup = BeautifulSoup(html, "html5lib")
        tables = soup.find_all("table")

        if len(tables) < 3:
            logger.error("网页结构异常，未找到数据表格")
            raise Exception("网页结构异常")

        table = tables[2]
        rows = table.find_all("tr")[2:]

        records = []
        for row in rows:
            cells = row.find_all("td")
            if len(cells) >= 16:
                records.append(
                    {
                        "times": cells[0].text.strip(),
                        "red_balls": [cells[i].text.strip() for i in range(1, 7)],
                        "blue_ball": cells[7].text.strip(),
                        "date": cells[15].text.strip(),
                    }
                )

        return records