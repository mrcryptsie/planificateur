from django.contrib import admin
from django.urls import path, include
from backend import bridge_api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.apps.exam_scheduler.urls')),
    # Routes de l'API de pont pour le frontend
    path('api/rooms', bridge_api.get_rooms, name='get_rooms'),
    path('api/proctors', bridge_api.get_proctors, name='get_proctors'),
    path('api/exams', bridge_api.get_exams, name='get_exams'),
    path('api/time-slots', bridge_api.get_timeslots, name='get_timeslots'),
    path('api/stats', bridge_api.get_stats, name='get_stats'),
]