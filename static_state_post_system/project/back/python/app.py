# SSPS 后端服务入口
from django.core.management import execute_from_command_line
import os
import sys

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ssps_backend.settings')
    
    # 如果没有提供命令行参数，则启动服务器
    if len(sys.argv) == 1:
        execute_from_command_line([sys.argv[0], 'runserver', '8000'])
    else:
        # 否则执行提供的命令
        execute_from_command_line(sys.argv)
