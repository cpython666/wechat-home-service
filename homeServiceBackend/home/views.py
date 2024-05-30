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


@api_view(['GET'])
def create_order(request):
	order_id = request.GET.get('order_id')
	customer_name = request.GET.get('customer_name')
	service_type = request.GET.get('service_type')
	preferred_date = request.GET.get('service_date')
	service_start_time = request.GET.get('service_start_time')
	service_end_time = request.GET.get('service_end_time')
	worker_name = request.GET.get('worker_name')
	service_cost = request.GET.get('service_cost')
	duration = request.GET.get('duration')
	status = request.GET.get('status')
	cost = request.GET.get('service_cost')
	customer = User.objects.filter(username=customer_name).first()
	service_obj = Service.objects.get(name=service_type)
	worker = WorkerProfile.objects.get(user__username=worker_name)
	print(request.GET)
	print(order_id, customer_name, service_type, service_start_time, service_end_time, status, worker_name,
	      service_cost, duration)
	print(customer, service_obj)
	
	order = Order.objects.create(
		order_id=order_id,
		customer=customer,
		worker=worker,
		service=service_obj,
		preferred_date=preferred_date,
		preferred_starttime=service_start_time,
		preferred_duration=duration,
		preferred_endtime=service_end_time,
		status=status,
		cost=cost
	)
	order_obj = OrderSerializer(order)
	return Response(order_obj.data, status=200)


@api_view(['GET'])
def change_order_status(request):
	order_id = request.GET.get('order_id')
	status = request.GET.get('status')
	print(request.GET)
	order = Order.objects.filter(
		order_id=order_id,
	).first()
	order.status = status
	order.save()
	order_obj = OrderSerializer(order)
	return Response(order_obj.data, status=200)


@api_view(['GET'])
def feedback_order(request):
	order_id = request.GET.get('order_id')
	feedback = request.GET.get('feedback')
	print(request.GET)
	order = Order.objects.filter(
		order_id=order_id,
	).first()
	order.status = '已评价'
	order.feedback = feedback
	order.save()
	order_obj = OrderSerializer(order)
	return Response(order_obj.data, status=200)


@api_view(['GET'])
def add_review(request):
	order_id = request.GET.get('order_id')
	content = request.GET.get('review')
	order = Order.objects.filter(
		order_id=order_id,
	).first()
	review = Review(order=order, content=content)
	print(review)
	review.save()
	return Response({}, status=200)


@api_view(['GET'])
def query_review(request):
	order_id = request.GET.get('order_id')
	order = Order.objects.filter(order_id=order_id, ).first()
	review = Review.objects.filter(order=order).first()
	review = ReviewSerializer(review)
	print(review.data)
	return Response(review.data, status=200)


@api_view(['GET'])
def update_customer(request):
	username = request.GET.get('username')
	realname = request.GET.get('name')
	email = request.GET.get('email')
	phone = request.GET.get('phone')
	address = request.GET.get('address')
	user = User.objects.filter(username=username).first()
	user.realname = realname
	user.email = email
	user.phone = phone
	user.address = address
	user.save()
	user = UserSerializer(user)
	return Response(user.data, status=200)


import json


@api_view(['GET'])
def save_schedule(request):
	print(request.GET)
	schedules = json.loads(request.GET.get('schedules'))
	print(schedules, request.GET.get('worker'))
	worker_username = request.GET.get('worker')
	worker = WorkerProfile.objects.filter(user__username=worker_username).first()
	print(worker)
	print(Schedule.objects.filter(worker__user__username=worker_username).delete())
	# 插入新的排班记录
	for schedule in schedules:
		date = schedule['date']
		for time_slot in schedule['timeSlots']:
			if time_slot['active']:
				Schedule.objects.create(
					worker=worker,
					work_date=date,
					start_time=time_slot['start'],
					end_time=time_slot['end'],
				)
	
	return Response({}, status=200)


@api_view(['POST'])
def test_post(request):
	print(request.POST)
	
	return Response({}, status=200)


@api_view(['POST'])
def upload_service_start_image(request):
	print(request.POST)
	print(request.FILES)
	order_id = request.POST.get('order_id')
	image = request.FILES.get('service_start_image')
	print(order_id, )
	if not order_id or not image:
		return Response({'success': False, 'message': '缺少订单ID或图片文件'}, status=400)
	order = Order.objects.filter(order_id=order_id).first()
	order.start_photo = image
	order.status = '服务人员开始服务'
	order.save()
	print(order)
	# 保存图片
	# 更新订单状态或其他相关逻辑
	order = OrderSerializer(order)
	print(order.data)
	return Response(order.data, status=200)


@api_view(['POST'])
def upload_service_end_image(request):
	print(request.POST)
	print(request.FILES)
	order_id = request.POST.get('order_id')
	image = request.FILES.get('service_end_image')
	print(order_id, )
	if not order_id or not image:
		return Response({'success': False, 'message': '缺少订单ID或图片文件'}, status=400)
	order = Order.objects.filter(order_id=order_id).first()
	order.end_photo = image
	order.status = '已完成'
	order.save()
	print(order)
	# 保存图片
	# 更新订单状态或其他相关逻辑
	order = OrderSerializer(order)
	print(order.data)
	return Response(order.data, status=200)


@api_view(['POST'])
def score_review(request):
	order_id = request.data.get('order_id')
	score = request.data.get('score')
	if score == '':
		score = 0
	score = int(score)
	review = Review.objects.filter(order__order_id=order_id).first()
	review.satisfaction = score
	review.status = '已评分'
	review.save()
	review = ReviewSerializer(review)
	return Response(review.data, status=200)


from .models import Service
from django.db import models


def dashboard_data(request):
	# 当前日期
	today = timezone.now().date()
	
	# 服务人员数量
	worker_count = WorkerProfile.objects.all().count()
	
	# 顾客数量
	customer_count = User.objects.filter(user_type='customer').count()
	
	# 今日订单数量
	today_orders_count = Order.objects.filter(preferred_date=today).count()
	
	# 进行中的订单数量
	active_orders_count = Order.objects.filter(status='进行中').count()
	
	# 服务类型统计数据
	service_types = Service.objects.values('category').annotate(total=models.Count('category'))
	service_data = {service['category']: service['total'] for service in service_types}
	
	# 近七天订单量数据
	orders_last_7_days = [
		Order.objects.filter(preferred_date=today - timezone.timedelta(days=i)).count()
		for i in range(7)
	]
	
	# 将数据整合成一个JSON对象返回
	return JsonResponse({
		'worker_count': worker_count,
		'customer_count': customer_count,
		'today_orders_count': today_orders_count,
		'active_orders_count': active_orders_count,
		'service_data': service_data,
		'orders_last_7_days': orders_last_7_days
	})


from .models import WorkerProfile, Schedule

from django.utils import timezone
from datetime import timedelta


def worker_data_statistics(request):
	# 获取当前日期（UTC）
	today = timezone.now().date()
	
	# 服务人员总数量
	worker_count = WorkerProfile.objects.count()
	
	# 今日活跃的服务人员数量
	active_workers_today = Schedule.objects.filter(work_date=today).values('worker').distinct().count()
	
	# 打印调试信息
	print("All WorkerProfile created_at dates (UTC):", [worker.created_at for worker in WorkerProfile.objects.all()])
	print("Today's date (UTC):", today)
	
	# 检查是否存在创建日期为今天的记录
	first_worker = WorkerProfile.objects.all().first()
	if first_worker:
		print([first_worker.created_at.date() == today])  # 应该是 True
	
	# 查询今天创建的WorkerProfile数量
	today_count = WorkerProfile.objects.filter(created_at__date=today).count()
	print(f"Records created on {today}: {today_count}")
	
	# 近七天新增的服务人员数量
	new_workers_last_7_days = [
		WorkerProfile.objects.filter(created_at__date=today - timedelta(days=i)).count()
		for i in range(7)
	]
	print("New workers in the last 7 days:", new_workers_last_7_days)
	
	# 服务类型统计
	services_type_count = WorkerProfile.objects.values('services__category').annotate(total=Count('id'))
	services_data = {item['services__category']: item['total'] for item in services_type_count if
	                 item['services__category']}
	
	return JsonResponse({
		'worker_count': worker_count,
		'active_workers_today': active_workers_today,
		'new_workers_last_7_days': new_workers_last_7_days,
		'services_data': services_data
	})


from .models import User


def customer_statistics(request):
	# 总顾客数
	total_customers = User.objects.filter(user_type='customer').count()
	
	# 性别分布统计
	gender_distribution = User.objects.filter(user_type='customer').values('gender').annotate(count=Count('gender'))
	
	gender_data = []
	for item in gender_distribution:
		gender_data.append({
			'label': item['gender'],
			'count': item['count']
		})
	
	return JsonResponse({
		'total_customers': total_customers,
		'gender_data': gender_data
	})


from .models import Order  # 假设您的订单模型是 Order


def service_statistics(request):
	# 总服务次数
	total_services = Order.objects.count()
	
	# 服务类型分布统计
	service_distribution = Order.objects.values('service__category').annotate(count=Count('service__category'))
	
	service_data = []
	for item in service_distribution:
		service_data.append({
			'label': item['service__category'],
			'count': item['count']
		})
	
	return JsonResponse({
		'total_services': total_services,
		'service_data': service_data
	})


from django.http import JsonResponse
from django.db.models import Count
from .models import Review  # 假设您的纠纷模型是 Review


def dispute_statistics(request):
	# 总纠纷次数
	total_disputes = Review.objects.count()
	
	# 纠纷类型分布统计
	dispute_distribution = Review.objects.values('content').annotate(count=Count('content'))
	
	dispute_data = []
	for item in dispute_distribution:
		dispute_data.append({
			'label': item['content'],
			'count': item['count']
		})
	
	return JsonResponse({
		'total_disputes': total_disputes,
		'dispute_data': dispute_data
	})
