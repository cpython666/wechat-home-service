from django.contrib import admin
from . import models

admin.site.register(models.User)
admin.site.register(models.CustomerProfile)
admin.site.register(models.WorkerProfile)
admin.site.register(models.Service)
admin.site.register(models.Order)
admin.site.register(models.Review)

admin.site.site_header = '家政预约管理后台'  # 设置header
admin.site.site_title = '家政预约管理后台'   # 设置title
admin.site.index_title = '家政预约管理后台'