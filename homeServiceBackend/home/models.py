from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
	address = models.CharField(max_length=255, blank=True, null=True, verbose_name='地址')
	phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name='电话号码')
	GENDER_CHOICES = (('private', '私密'), ('male', '男'), ('female', '女'))
	gender = models.CharField(max_length=12, choices=GENDER_CHOICES, default='private', verbose_name='性别')
	USER_TYPE_CHOICES = (('customer', '顾客'), ('admin', '管理员'), ('worker', '工作人员'))
	user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='customer', verbose_name='用户类型')
	groups = models.ManyToManyField(
		'auth.Group', verbose_name='groups', blank=True,
		help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
		related_name="user_set_custom", related_query_name="user_custom",
	)
	user_permissions = models.ManyToManyField(
		'auth.Permission', verbose_name='user permissions', blank=True,
		help_text='Specific permissions for this user.',
		related_name="user_set_custom", related_query_name="user_custom",
	)
	
	def __str__(self):
		if self.email:
			return f"{self.get_user_type_display()}:{self.username} - 邮箱: {self.email}"
		return f"{self.get_user_type_display()}:{self.username}"
	
	class Meta:
		verbose_name = "用户档案"
		verbose_name_plural = "用户档案"
		indexes = [
			models.Index(fields=['username']),
			models.Index(fields=['email']),
			models.Index(fields=['phone_number']),
		]


class Service(models.Model):
	name = models.CharField(max_length=100, verbose_name='服务名')
	description = models.TextField(verbose_name='服务详情')
	CATEGORY_CHOICES = (
		('cleaning', '清洁'),
		('cooking', '烹饪'),
		('caregiving', '看护'),
	)
	category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='cleaning', verbose_name='服务分类')
	price_per_hour = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='小时单价')
	image_name = models.CharField(max_length=50, null=True)
	
	class Meta:
		verbose_name = "服务类型"
		verbose_name_plural = "服务类型"
	
	def __str__(self):
		return f"服务分类：{self.category}，服务名：{self.name} - 小时单价：{self.price_per_hour}元 - 详细描述：{self.description}"


class CustomerProfile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
	preferred_services = models.ManyToManyField(
		'Service',
		verbose_name='服务偏好',
		blank=True,
		help_text='顾客偏好的服务类型'
	)
	
	def __str__(self):
		return f"{self.user}"
	
	class Meta:
		verbose_name = "顾客档案"
		verbose_name_plural = "顾客档案"


class WorkerProfile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='worker_profile')
	services = models.ManyToManyField(Service, verbose_name='提供的服务')
	rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0, verbose_name='评分')
	
	def __str__(self):
		return f'{self.user}'
	
	class Meta:
		verbose_name = "工作人员档案"
		verbose_name_plural = "工作人员档案"


class Schedule(models.Model):
	worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE, related_name='schedules',
	                           verbose_name='工作人员')
	work_date = models.DateField(verbose_name='工作日期')
	start_time = models.TimeField(verbose_name='开始时间')
	end_time = models.TimeField(verbose_name='结束时间')
	
	class Meta:
		verbose_name = "服务人员排班档案"
		verbose_name_plural = "服务人员排班档案"
		indexes = [
			models.Index(fields=['work_date']),
		]
	
	def __str__(self):
		return f'工作人员：{self.worker.user.username}，日期：{self.work_date}，时间：{self.start_time}-{self.end_time}'


class Order(models.Model):
	customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customer_orders', verbose_name='顾客')
	worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE, null=True, related_name='worker_orders',
	                           verbose_name='工作人员')
	service = models.ForeignKey(Service, on_delete=models.CASCADE, verbose_name='服务类型')
	creation_time = models.DateTimeField(auto_now_add=True, verbose_name='订单创建时间')
	start_time = models.DateTimeField(verbose_name='订单开始时间')
	completion_time = models.DateTimeField(null=True, blank=True, verbose_name='订单完成时间')
	duration = models.IntegerField(help_text="服务时长", verbose_name='服务持续时长')
	preferred_date = models.DateField(null=True, blank=True, verbose_name='首选日期')
	preferred_time = models.TimeField(null=True, blank=True, verbose_name='首选时间')
	start_photo = models.ImageField(upload_to='order_photos/start/', null=True, blank=True, verbose_name='服务开始照片')
	end_photo = models.ImageField(upload_to='order_photos/end/', null=True, blank=True, verbose_name='服务结束照片')
	STATUS_CHOICES = (
		('pending', '待确认'),
		('confirmed', '已确认'),
		('worker_start', '服务人员开始服务'),
		('start', '顾客确认开始服务'),
		('in_progress', '进行中'),
		('completed', '已完成'),
		('cancelled', '已取消'),
	)
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='订单状态')
	feedback = models.TextField(blank=True, null=True, verbose_name='订单反馈')
	order_rating = models.DecimalField(max_digits=2, decimal_places=1, verbose_name='评分', null=True, blank=True)
	
	class Meta:
		verbose_name = "订单档案"
		verbose_name_plural = "订单档案"
		indexes = [
			models.Index(fields=['creation_time']),
			models.Index(fields=['start_time']),
		]
	
	def __str__(self):
		return f'顾客：{self.customer.username}，工作人员：{self.worker.user.username}，订单状态：{self.get_status_display()}'


class Review(models.Model):
	order = models.OneToOneField(Order, on_delete=models.CASCADE, verbose_name='订单id')
	satisfaction = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True, verbose_name='满意度')
	content = models.TextField(blank=True, null=True, verbose_name='投诉与纠纷内容')
	resolution = models.TextField(blank=True, null=True, verbose_name='处理结果')
	
	def save(self, *args, **kwargs):
		super().save(*args, **kwargs)
	
	class Meta:
		verbose_name = "投诉与纠纷档案"
		verbose_name_plural = "投诉与纠纷档案"
		indexes = [
			models.Index(fields=['order']),
		]
	
	def __str__(self):
		return f'订单：{self.order.id}，投诉：{self.content[:20]}'


class Booking(models.Model):
	customer = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='预约的客户')
	service = models.ForeignKey(Service, on_delete=models.CASCADE, verbose_name='服务')
	booking_date = models.DateField(verbose_name='预约日期')
	booking_time = models.TimeField(verbose_name='预约时间')
	status = models.CharField(max_length=20,
	                          choices=[('pending', '待处理'), ('confirmed', '已确认'), ('completed', '已完成'),
	                                   ('cancelled', '已取消')], default='pending', verbose_name='预约状态')
	
	class Meta:
		verbose_name = "预约档案"
		verbose_name_plural = "预约档案"
	
	def __str__(self):
		return f'顾客：{self.customer.username}，服务：{self.service.name}，状态：{self.status}'
