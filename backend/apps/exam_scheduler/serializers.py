from rest_framework import serializers
from .models import Room, Proctor, Exam, TimeSlot

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class ProctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proctor
        fields = '__all__'

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = '__all__'

class ExamDetailSerializer(serializers.ModelSerializer):
    room = RoomSerializer(read_only=True)
    proctors = ProctorSerializer(many=True, read_only=True)
    
    class Meta:
        model = Exam
        fields = '__all__'