from django.contrib import admin

from . import models
from .models import WorkerProfile


class WorkerProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'rating', 'info', 'qualification_document')
	search_fields = ('user__username', 'info')
	filter_horizontal = ('services',)  # 确保多对多字段在管理后台中显示为水平过滤器


admin.site.register(WorkerProfile, WorkerProfileAdmin)
admin.site.register(models.User)
admin.site.register(models.CustomerProfile)
# admin.site.register(models.WorkerProfile)
admin.site.register(models.Service)
admin.site.register(models.Order)
admin.site.register(models.Review)

admin.site.site_header = '家政预约管理后台'  # 设置header
admin.site.site_title = '家政预约管理后台'  # 设置title
admin.site.index_title = '家政预约管理后台'
