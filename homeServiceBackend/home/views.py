from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action

from .models import User, CustomerProfile, WorkerProfile, Service, Order, Review, Booking, Schedule
from .serializers import UserSerializer, CustomerProfileSerializer, WorkerProfileSerializer, ServiceSerializer, \
	OrderSerializer, ReviewSerializer, BookingSerializer, ScheduleSerializer


class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	
	@action(detail=False, methods=['post'])
	def login(self, request):
		username = request.data.get('username')
		password = request.data.get('password')
		user = User.objects.get(username=username)
		if user.check_password(password):
			serializer = self.get_serializer(user)  # 序列化用户对象
			return Response(serializer.data, status=status.HTTP_200_OK)
		else:
			return Response({'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


class CustomerProfileViewSet(viewsets.ModelViewSet):
	queryset = CustomerProfile.objects.all()
	serializer_class = CustomerProfileSerializer


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


class BookingViewSet(viewsets.ModelViewSet):
	queryset = Booking.objects.all()
	serializer_class = BookingSerializer


class ScheduleViewSet(viewsets.ModelViewSet):
	queryset = Schedule.objects.all()
	serializer_class = ScheduleSerializer


def dashboard(request):
	return render(request, 'home/dashboard.html')


def page41(request):
	return render(request, 'home/page41.html')


def page42(request):
	return render(request, 'home/page42.html')


def page43(request):
	return render(request, 'home/page43.html')


def page44(request):
	return render(request, 'home/page44.html')


def workercreat(request):
	return render(request, 'home/workercreat.html')


from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import WorkerProfile
from .serializers import WorkerProfileSerializer


@api_view(['POST'])
def create_worker(request):
	username = request.data.get('username')
	email = request.data.get('email')
	phone_number = request.data.get('phone_number')
	gender = request.data.get('gender')
	password = request.data.get('password')
	services = request.data.getlist('services')
	rating = request.data.get('rating', 5)
	qualification_document = request.FILES.get('qualification_document')
	
	# 检查必要字段
	if not all([username, email, phone_number, gender, password]):
		return Response({'error': '缺少必要字段'}, status=400)
	
	# 创建用户
	user = User.objects.create_user(username=username, email=email, password=password)
	user.phone_number = phone_number
	user.gender = gender
	user.user_type = 'worker'
	user.save()
	
	# 创建工作者档案
	worker_profile = WorkerProfile.objects.create(
		user=user,
		rating=rating,
		info=f"Phone number: {phone_number}, Gender: {gender}",
		qualification_document=qualification_document
	)
	worker_profile.services.set(services)
	worker_profile.save()
	
	# 序列化并返回响应
	serializer = WorkerProfileSerializer(worker_profile)
	return Response(serializer.data, status=200)
