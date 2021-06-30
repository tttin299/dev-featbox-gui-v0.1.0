from rest_framework import serializers
from .models import BoardFarm, Board, Board_Log
from rest_framework.response import Response


class BoardFarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardFarm
        fields = ('farm_id', 'user_id', 'created_date', 'status', 'host_ip_address', 'host_user', 'host_password', 'host_script_location')

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ('board_id', 'farm_id', 'board_i2c_address', 'board_name', 'power_status', 'switch_status', 'mode_status')

class Board_LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board_Log
        fields = ('id', 'board_id', 'date', 'time', 'action', 'status')