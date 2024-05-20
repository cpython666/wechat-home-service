from rest_framework import serializers
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import User, CustomerProfile, WorkerProfile, Service, Order, Review
from .serializers import UserSerializer, CustomerProfileSerializer, WorkerProfileSerializer, ServiceSerializer, \
	OrderSerializer, ReviewSerializer


class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	
	@action(detail=False, methods=['post'])
	def login(self, request):
		username = request.data.get('username')
		password = request.data.get('password')
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			serializer = self.get_serializer(user)  # 序列化用户对象
			return Response(serializer.data, status=status.HTTP_200_OK)
		else:
			print(username)
			return Response({'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


class CustomerProfileViewSet(viewsets.ModelViewSet):
	queryset = CustomerProfile.objects.all()
	serializer_class = CustomerProfileSerializer
	
	def perform_create(self, serializer):
		if CustomerProfile.objects.filter(user=serializer.validated_data['user']).exists():
			raise serializers.ValidationError({'user': '该用户地址信息已存在，不能创建'})
		serializer.save()


class WorkerProfileViewSet(viewsets.ModelViewSet):
	queryset = WorkerProfile.objects.all()
	serializer_class = WorkerProfileSerializer


class ServiceViewSet(viewsets.ModelViewSet):
	queryset = Service.objects.all()
	serializer_class = ServiceSerializer


class OrderViewSet(viewsets.ModelViewSet):
	queryset = Order.objects.all()
	serializer_class = OrderSerializer


class ReviewViewSet(viewsets.ModelViewSet):
	queryset = Review.objects.all()
	serializer_class = ReviewSerializer


from django.shortcuts import render


def dashboard(request):
	return render(request, 'home/dashboard.html')


def page41(request):
	return render(request, 'home/page41.html')


def page42(request):
	return render(request, 'home/page42.html')
