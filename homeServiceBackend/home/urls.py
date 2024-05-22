from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'customer_profiles', views.CustomerProfileViewSet)
router.register(r'worker_profiles', views.WorkerProfileViewSet)
router.register(r'services', views.ServiceViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'reviews', views.ReviewViewSet)
router.register(r'bookings', views.BookingViewSet)
router.register(r'schedules', views.ScheduleViewSet)

urlpatterns = [
	path('', include(router.urls)),
	path('home/dashboard/', views.dashboard, name='dashboard'),
	path('home/page41/', views.page41, name='page41'),
	path('home/page42/', views.page42, name='page42'),
	path('home/page43/', views.page43, name='page43'),
	path('home/page44/', views.page44, name='page44'),
	path('home/workercreat/', views.workercreat, name='workercreat'),
	
	path('create_worker/', views.create_worker, name='create_worker'),

]
