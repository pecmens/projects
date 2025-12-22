from rest_framework import serializers
from .models import Article
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class ArticleSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 
            'published', 'created_at', 'updated_at', 
            'category', 'tags', 'author'
        ]
        lookup_field = 'slug'
    
    def create(self, validated_data):
        # 如果用户已认证，则将当前用户设为作者
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['author'] = request.user
        return super().create(validated_data)


class ArticleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'excerpt', 'published', 'created_at', 'updated_at', 'category']
        lookup_field = 'slug'


class CategorySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100)
    slug = serializers.SlugField()
    description = serializers.CharField(required=False, allow_blank=True)


class TagSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=50)
    slug = serializers.SlugField()