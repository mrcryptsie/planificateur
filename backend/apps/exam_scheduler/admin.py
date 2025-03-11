from django.contrib import admin
from .models import Room, Proctor, Exam, TimeSlot

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'capacity', 'occupancy_rate', 'status')
    list_filter = ('status',)
    search_fields = ('name',)

@admin.register(Proctor)
class ProctorAdmin(admin.ModelAdmin):
    list_display = ('name', 'department')
    list_filter = ('department',)
    search_fields = ('name',)

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'level', 'department', 'duration', 'room')
    list_filter = ('level', 'department', 'date')
    search_fields = ('name',)

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('start_time', 'end_time', 'room', 'exam')
    list_filter = ('start_time', 'room')
    search_fields = ('exam__name', 'room__name')