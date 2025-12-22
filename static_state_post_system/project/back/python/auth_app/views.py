from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .serializers import UserSerializer, LoginSerializer, CustomTokenObtainPairSerializer
import logging

# 设置日志
logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 检查用户名和邮箱是否已存在
        username = request.data.get('username')
        email = request.data.get('email')
        
        if User.objects.filter(username=username).exists():
            return Response(
                {'success': False, 'error': '用户名已存在'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(email=email).exists():
            return Response(
                {'success': False, 'error': '邮箱已被注册'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = serializer.save()
        
        # 登录用户并返回token
        login_serializer = LoginSerializer(data=request.data)
        login_serializer.is_valid(raise_exception=True)
        user = login_serializer.validated_data["user"]
        
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        # 记录注册事件
        logger.info(f"新用户注册: {user.username}")
        
        return Response({
            'success': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'token': str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user(request):
    """获取当前用户信息，此端点用于验证令牌"""
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'user': serializer.data
        })
    else:
        return Response({
            'success': False,
            'error': '未认证'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """登录视图"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'success': False,
            'error': '用户名和密码都是必需的'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if not user:
        logger.warning(f"登录失败: 无效凭据 - {username}")
        return Response({
            'success': False,
            'error': '用户名或密码错误'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    # 生成JWT令牌
    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(user)
    
    # 记录登录事件
    logger.info(f"用户登录成功: {user.username}")
    
    return Response({
        'success': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        },
        'token': str(refresh.access_token)
    })