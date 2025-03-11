from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RoomViewSet, ProctorViewSet, ExamViewSet, 
    TimeSlotViewSet, get_stats, schedule_exams, manual_schedule
)

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'proctors', ProctorViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'time-slots', TimeSlotViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', get_stats, name='get_stats'),
    path('schedule/', schedule_exams, name='schedule_exams'),
    path('manual-schedule/', manual_schedule, name='manual_schedule'),
    path('generate-timeslots/', generate_timeslots, name='generate_timeslots'),
]