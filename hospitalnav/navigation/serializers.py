from rest_framework import serializers
from .models import Blueprint

class BlueprintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blueprint
        fields = '__all__'
        extra_kwargs = {
            'room_details': {'required': False, 'allow_null': True},
            'connectivity_graph': {'required': False, 'allow_null': True},
        }
