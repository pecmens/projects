from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from auth_app.views import CustomTokenObtainPairView, RegisterView, get_user, login_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', login_view, name='login'),  # 新的登录端点
    path('api/auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # 保留原有的token端点
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/user/', get_user, name='get_user'),
    path('api/', include('articles.urls')),  # 文章 API
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
