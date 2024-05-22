from django.db import models


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

class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    address = models.TextField()

    def __str__(self):
        return self.name

class ServiceProvider(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    service_types = models.ManyToManyField(Service)

    def __str__(self):
        return self.name

class Schedule(models.Model):
    service_provider = models.ForeignKey(ServiceProvider, on_delete=models.CASCADE)
    date = models.DateField(verbose_name='预约的日期')
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f'{self.service_provider.name} on {self.date}'

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    service_provider = models.ForeignKey(ServiceProvider, on_delete=models.CASCADE)
    service_type = models.ForeignKey(Service, on_delete=models.CASCADE)
    pre_date = models.DateField()
    pre_start_time = models.TimeField()
    pre_end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=[('待处理', '待处理'),
                                                      ('工作人员已开始', '工作人员已开始'),
                                                      ('顾客已确认开始', '顾客已确认开始'),
                                                      ('已完成', '已完成'),
                                                      ('已取消', '已取消',)])

    def __str__(self):
        return f'Order {self.id} - {self.service_type.name} for {self.customer.name}'

class Complaint(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    service_provider = models.ForeignKey(ServiceProvider, on_delete=models.CASCADE)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Resolved', 'Resolved'), ('Dismissed', 'Dismissed')])

    def __str__(self):
        return f'Complaint {self.id} for Order {self.order.id}'