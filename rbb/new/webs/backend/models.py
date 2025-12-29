from datetime import datetime

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class LotteryRecord(db.Model):
    """双色球开奖记录模型"""

    __tablename__ = "lottery_records"

    id = db.Column(db.Integer, primary_key=True)
    times = db.Column(db.String(10), unique=True, nullable=False, index=True)
    date = db.Column(db.String(20), nullable=False, index=True)
    rb1 = db.Column(db.String(5), nullable=False)
    rb2 = db.Column(db.String(5), nullable=False)
    rb3 = db.Column(db.String(5), nullable=False)
    rb4 = db.Column(db.String(5), nullable=False)
    rb5 = db.Column(db.String(5), nullable=False)
    rb6 = db.Column(db.String(5), nullable=False)
    bb = db.Column(db.String(5), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "times": self.times,
            "date": self.date,
            "red_balls": [self.rb1, self.rb2, self.rb3, self.rb4, self.rb5, self.rb6],
            "blue_ball": self.bb,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    @classmethod
    def from_dict(cls, data):
        """从字典创建实例"""
        return cls(
            times=data["times"],
            date=data["date"],
            rb1=data["red_balls"][0],
            rb2=data["red_balls"][1],
            rb3=data["red_balls"][2],
            rb4=data["red_balls"][3],
            rb5=data["red_balls"][4],
            rb6=data["red_balls"][5],
            bb=data["blue_ball"],
        )
