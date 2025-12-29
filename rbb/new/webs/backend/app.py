import logging
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from common.data_fetcher import DataFetcher
from common.prize_checker import PrizeChecker
from common.statistics import StatisticsService
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy
from models import LotteryRecord, db

# 导入本地配置
from webs.backend.config import Config

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(Config)

# 配置 CORS
CORS(
    app,
    resources={r"/api/*": {"origins": Config.CORS_ORIGINS}},
    supports_credentials=True,
)

# 配置速率限制
limiter = Limiter(app=app, key_func=get_remote_address, default_limits=[Config.RATE_LIMIT])

db.init_app(app)

# 初始化服务
data_fetcher = DataFetcher(Config.DATA_URL)
prize_checker = PrizeChecker()


@app.route("/api/health", methods=["GET"])
def health():
    """健康检查"""
    return jsonify({"status": "ok", "message": "API is running"})


@app.route("/api/records", methods=["GET"])
def get_records():
    """获取开奖记录"""
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    query = LotteryRecord.query.order_by(LotteryRecord.times.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify(
        {
            "records": [r.to_dict() for r in pagination.items],
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": page,
        }
    )


@app.route("/api/records/<times>", methods=["GET"])
def get_record(times):
    """获取单条记录"""
    record = LotteryRecord.query.filter_by(times=times).first()
    if not record:
        return jsonify({"error": "记录不存在"}), 404
    return jsonify(record.to_dict())


@app.route("/api/records/search", methods=["GET"])
def search_records():
    """搜索记录"""
    times = request.args.get("times")
    date = request.args.get("date")

    query = LotteryRecord.query

    if times:
        query = query.filter(LotteryRecord.times == times)
    if date:
        query = query.filter(LotteryRecord.date == date)

    records = query.order_by(LotteryRecord.times.desc()).limit(100).all()
    return jsonify({"records": [r.to_dict() for r in records]})


@app.route("/api/check", methods=["POST"])
@limiter.limit("10 per minute")
def check_prize():
    """核对中奖"""
    try:
        data = request.get_json()
        if not data:
            logger.warning("无效的请求数据")
            return jsonify({"error": "请求数据无效"}), 400

        red_balls = data.get("red_balls", [])
        blue_ball = data.get("blue_ball")
        times = data.get("times")

        # 输入验证
        if not isinstance(red_balls, list) or len(red_balls) != 6:
            return jsonify({"error": "请输入6个红球"}), 400
        if not blue_ball:
            return jsonify({"error": "请输入蓝球"}), 400

        # 验证红球范围
        for ball in red_balls:
            try:
                num = int(ball)
                if not (1 <= num <= 33):
                    return jsonify({"error": f"红球号码 {ball} 无效，范围应为 01-33"}), 400
            except (ValueError, TypeError):
                return jsonify({"error": f"红球号码 {ball} 格式错误"}), 400

        # 验证蓝球范围
        try:
            blue_num = int(blue_ball)
            if not (1 <= blue_num <= 16):
                return jsonify({"error": f"蓝球号码 {blue_ball} 无效，范围应为 01-16"}), 400
        except (ValueError, TypeError):
            return jsonify({"error": f"蓝球号码 {blue_ball} 格式错误"}), 400

        user_numbers = {"red": red_balls, "blue": blue_ball}

        if times:
            record = LotteryRecord.query.filter_by(times=times).first()
            if not record:
                logger.warning(f"记录不存在: {times}")
                return jsonify({"error": "记录不存在"}), 404
            prize = prize_checker.check(user_numbers, record.to_dict())
            return jsonify({"prize": prize, "record": record.to_dict()})
        else:
            record = LotteryRecord.query.order_by(LotteryRecord.times.desc()).first()
            if not record:
                logger.warning("暂无数据")
                return jsonify({"error": "暂无数据"}), 404
            prize = prize_checker.check(user_numbers, record.to_dict())
            return jsonify({"prize": prize, "record": record.to_dict()})
    except Exception as e:
        logger.error(f"核对中奖失败: {e}")
        return jsonify({"error": "服务器内部错误"}), 500


@app.route("/api/stats", methods=["GET"])
def get_statistics():
    """获取统计数据"""
    records = LotteryRecord.query.order_by(LotteryRecord.times.desc()).limit(500).all()
    records_data = [r.to_dict() for r in records]

    stats_service = StatisticsService(records_data)

    return jsonify(
        {
            "red_frequency": stats_service.red_ball_frequency(33),
            "blue_frequency": stats_service.blue_ball_frequency(16),
            "hot_numbers": stats_service.get_hot_numbers(6, 3),
            "cold_numbers": stats_service.get_cold_numbers(6, 3),
        }
    )


@app.route("/api/update", methods=["POST"])
@limiter.limit("5 per hour")
def update_data():
    """更新数据"""
    try:
        logger.info("开始更新数据")
        records_data = data_fetcher.fetch()

        added = 0
        updated = 0

        for data in records_data:
            record = LotteryRecord.query.filter_by(times=data["times"]).first()
            if record:
                record.date = data["date"]
                record.rb1 = data["red_balls"][0]
                record.rb2 = data["red_balls"][1]
                record.rb3 = data["red_balls"][2]
                record.rb4 = data["red_balls"][3]
                record.rb5 = data["red_balls"][4]
                record.rb6 = data["red_balls"][5]
                record.bb = data["blue_ball"]
                updated += 1
            else:
                record = LotteryRecord.from_dict(data)
                db.session.add(record)
                added += 1

        db.session.commit()
        logger.info(f"数据更新完成: 新增 {added} 条, 更新 {updated} 条")

        return jsonify(
            {"message": "更新成功", "added": added, "updated": updated, "total": len(records_data)}
        )
    except Exception as e:
        db.session.rollback()
        logger.error(f"数据更新失败: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/init", methods=["POST"])
@limiter.limit("3 per hour")
def init_database():
    """初始化数据库"""
    try:
        logger.info("开始初始化数据库")
        db.create_all()
        records_data = data_fetcher.fetch()

        for data in records_data:
            record = LotteryRecord.query.filter_by(times=data["times"]).first()
            if not record:
                record = LotteryRecord.from_dict(data)
                db.session.add(record)

        db.session.commit()
        logger.info(f"数据库初始化成功: {len(records_data)} 条记录")

        return jsonify({"message": "数据库初始化成功", "total": len(records_data)})
    except Exception as e:
        db.session.rollback()
        logger.error(f"数据库初始化失败: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
