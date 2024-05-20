from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include
from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
	openapi.Info(
		title="家政预约系统 API文档",
		default_version='v1',
		description="这是家政预约系统的openapi风格的api文档",
		terms_of_service="https://space.bilibili.com/1909782963",
		contact=openapi.Contact(email="2942581284@qq.com"),
		license=openapi.License(name="BSD License"),
	),
	public=True,
	permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
	              path("admin/", admin.site.urls),
	              path("", include('home.urls')),
	              
	              path('auth/', include('rest_framework.urls')),
	              
	              path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
	              path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
	              path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
