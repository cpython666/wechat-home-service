from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.response import Response

from .models import User, CustomerProfile, WorkerProfile, Service, Order, Review


class UserSerializer(serializers.ModelSerializer):
	def create(self, validated_data):
		password = validated_data.pop('password')  # 从验证数据中取出密码
		validated_data['password'] = make_password(password)  # 对密码进行哈希化
		return super().create(validated_data)  # 调用父类的 create() 方法创建用户
	
	def update(self, instance, validated_data):
		if 'password' in validated_data:
			password = validated_data.pop('password')
			instance.password = make_password(password)
		return super().update(instance, validated_data)
	
	class Meta:
		model = User
		fields = ['id', 'username', 'password', 'phone_number', 'gender', 'user_type']


class CustomerProfileSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(
		queryset=User.objects.filter(user_type='customer').order_by('id'),
	)
	
	class Meta:
		model = CustomerProfile
		fields = '__all__'


class WorkerProfileSerializer(serializers.ModelSerializer):
	user = serializers.PrimaryKeyRelatedField(
		queryset=User.objects.filter(user_type='worker').order_by('id'),
	)
	services = serializers.PrimaryKeyRelatedField(many=True, queryset=Service.objects.all())
	
	class Meta:
		model = WorkerProfile
		fields = ['user', 'services', 'rating']
		read_only_fields = ['rating']
	
	def create(self, validated_data):
		username = validated_data.pop('username')
		email = validated_data.pop('email')
		phone_number = validated_data.pop('phone_number')
		gender = validated_data.pop('gender')
		password = validated_data.pop('password')
		services = validated_data.pop('services')
		rating = validated_data.pop('rating')
		
		user = User.objects.create(
			username=username,
			email=email,
			phone_number=phone_number,
			gender=gender,
		)
		user.set_password(password)
		user.save()
		
		worker_profile = WorkerProfile.objects.create(user=user, rating=rating)
		worker_profile.services.set(services)
		worker_profile.save()
		
		serializer = WorkerProfileSerializer(worker_profile)
		return Response(serializer.data, status=201)


class ServiceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Service
		fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
	class Meta:
		model = Order
		fields = ['customer', 'worker', 'service', 'creation_time', 'start_time', 'completion_time', 'duration',
		          'status']


class ReviewSerializer(serializers.ModelSerializer):
	class Meta:
		model = Review
		fields = ['order', 'rating', 'content']
