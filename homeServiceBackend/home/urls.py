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
	path('create_order/', views.create_order, name='create_order'),
	path('save_schedule/', views.save_schedule, name='save_schedule'),
	path('change_order_status/', views.change_order_status, name='change_order_status'),
	path('feedback_order/', views.feedback_order, name='feedback_order'),
	path('add_review/', views.add_review, name='add_review'),
	path('query_review/', views.query_review, name='query_review'),
	path('update_customer/', views.update_customer, name='update_customer'),
	path('test_post/', views.test_post, name='test_post'),
	path('upload_service_start_image/', views.upload_service_start_image, name='upload_service_start_image'),
	path('upload_service_end_image/', views.upload_service_end_image, name='upload_service_end_image'),
	path('score_review/', views.score_review, name='score_review'),
	path('dashboard_data/', views.dashboard_data, name='dashboard_data'),
	path('worker_data_statistics/', views.worker_data_statistics, name='worker_data_statistics'),
	path('api/customer-statistics/', views.customer_statistics, name='customer-statistics'),
	path('api/service-statistics/', views.service_statistics, name='service-statistics'),
	path('api/dispute-statistics/', views.dispute_statistics, name='dispute-statistics'),
]
