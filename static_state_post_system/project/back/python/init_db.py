#!/usr/bin/env python
"""
SSPS Django 项目初始化脚本
用于创建数据库、应用迁移和初始数据
"""

import os
import sys
from django.core.management import execute_from_command_line
from django.contrib.auth import get_user_model

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ssps_backend.settings')
    
    # 执行数据库迁移
    print("正在执行数据库迁移...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    # 创建超级用户（如果不存在）
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        print("正在创建初始超级用户...")
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("超级用户创建成功: admin / admin123")
    else:
        print("超级用户已存在")
    
    print("\nDjango 后端初始化完成!")
    print("1. 运行 'python manage.py runserver' 启动开发服务器")
    print("2. 访问 http://localhost:8000/admin/ 管理内容")
    print("3. API 端点: http://localhost:8000/api/")

if __name__ == '__main__':
    main()
