from django.test import TestCase

from .models import Service


class ServiceModelTest(TestCase):
	def setUp(self):
		# 创建一个服务对象用于测试
		Service.objects.create(
			name="全面屋子清洁",
			description="包括扫地、擦窗及除尘等服务",
			category='cleaning',
			price_per_hour=150.00,
			image_name='cleaning_service.jpg'
		)
	
	def test_service_creation(self):
		# 检索刚才创建的服务对象
		service = Service.objects.get(name="全面屋子清洁")
		# 验证对象的属性是否正确
		self.assertEqual(service.description, "包括扫地、擦窗及除尘等服务")
		self.assertEqual(service.category, 'cleaning')
		self.assertEqual(service.price_per_hour, 150.00)
		self.assertEqual(service.image_name, 'cleaning_service.jpg')
	
	def test_service_string_representation(self):
		# 检索服务对象
		service = Service.objects.get(name="全面屋子清洁")
		# 测试对象的 __str__ 方法是否返回预期的字符串
		expected_string = "服务分类：cleaning，服务名：全面屋子清洁 - 小时单价：150.00元 - 详细描述：包括扫地、擦窗及除尘等服务"
		self.assertEqual(str(service), expected_string)


new_service = Service(
	name='家庭全面清洁',
	description='包括室内外的全面清洁服务',
	category='cleaning',
	price_per_hour=150.00,
	image_name='cleaning_service.jpg'
)
new_service.save()
