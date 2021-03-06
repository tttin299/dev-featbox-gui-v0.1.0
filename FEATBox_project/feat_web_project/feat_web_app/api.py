from rest_framework import viewsets, permissions, generics
from .models import User, BoardFarm, Board, Board_Log
from .serializers import BoardFarmSerializer, BoardSerializer, Board_LogSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import action
import os
import subprocess
import collections
import socket
import json


class BoardFarmViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.AllowAny
        # permissions.IsAuthenticated,
    ]
    serializer_class = BoardFarmSerializer

    def push_cmd_ssh(self, command, host_user, host_ip_address, host_password, host_script_location, farm_id):
        # hostname = socket.gethostname()
        # local_ip = socket.gethostbyname(hostname)

        feat_database = os.path.dirname(os.path.realpath(__file__)) + "/config_database.json"
        with open(feat_database, "r") as json_file:
            database = json.load(json_file)

        db=database["database"]
        host=database["host"]
        port= database["port"]
        user=database["username"]
        password=database["password"]

        data = { 
                "user": host_user,
                "password": host_password,
                "host": host_ip_address,
                "command": 'cd ' + host_script_location + '; rm -rf -- feat_database.json ; echo { \\""database"\\": \\""' + db + '"\\", \\""host"\\": \\""' + host + '"\\", \\""port"\\": \\""' + port + '"\\", \\""username"\\": \\""' + user + '"\\", \\""password"\\": \\""' + password + '"\\", \\""farm_id"\\": \\""' + str(farm_id) + '"\\"} > feat_database.json'
                }
        
        command_ssh = 'sshpass -p {password} ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null {user}@{host} \'{command}\''
        # command_no_ssh_linux = 'echo { \\""database"\\": \\""db_featweb"\\", \\""host"\\": \\""db"\\", \\""port"\\": \\""3306"\\", \\""username"\\": \\""root"\\",\\""password"\\": \\""1234"\\"} > host_script_stub_'+ host_user +'@'+ host_ip_address + '/feat_database.json'
        # command_no_ssh = 'echo { "database": "db_featweb", "host": "' + local_ip + '", "port": "3306", "username": "root","password": "1234"} > ../host_script_stub_'+ host_user +'@'+ host_ip_address + '/feat_database.json'
 
        return_code = os.system(command_ssh.format(**data))
        if return_code == 0:
            data = { 
                "user": host_user,
                "password": host_password,
                "host": host_ip_address,
                "command": "cd " + host_script_location + "; ./host_ctrl.py {0}".format(command),
                }
            command_ssh = "sshpass -p {password} ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null {user}@{host} \'{command}\'"
            # return_code = os.system(command_ssh.format(**data))

            # command_no_ssh = 'py ../host_script_stub_'+ host_user +'@'+host_ip_address+'/host_ctrl.py ' + command 
            return_code = os.system(command_ssh.format(**data))
            if return_code == 0:
                rs = "SSH " + command + " was successful"
                return rs
            else:
                rs = "SSH " + command + " failed"
                return rs
        else:
            rs = "SSH send json file failed"
            return rs

    def get_queryset(self):
        for obj in BoardFarm.objects.all():
            return_code = self.push_cmd_ssh("status", obj.host_user, obj.host_ip_address, obj.host_password, obj.host_script_location, obj.farm_id)
            print(return_code)
        return BoardFarm.objects.all()

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        # print(serializer)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        queryset = BoardFarm.objects.last()
        farm_id = queryset.farm_id

        return_code = self.push_cmd_ssh("init", request.data["host_user"], request.data["host_ip_address"], request.data["host_password"], request.data["host_script_location"], farm_id) 
        print(return_code)
        return Response()
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BoardViewSet(viewsets.ModelViewSet):
    permissions_classes = [
        permissions.AllowAny
    ]
    serializer_class = BoardSerializer
        
    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = Board.objects.all()
        farm_id = self.request.query_params.get('farm_id', None)
        if farm_id is not None:
            queryset = queryset.filter(farm_id=farm_id)
        return queryset


class Board_LogViewSet(viewsets.ModelViewSet):
    permissions_classes = [
        permissions.AllowAny
    ]
    serializer_class = Board_LogSerializer

    def push_cmd_ssh(self, command, host_user, host_ip_address, host_password, board_i2c_address, host_script_location):
        data = { 
            "user": host_user,
            "host": host_ip_address,
            "password": host_password,
            "board_i2c_address": board_i2c_address,
            "action": command,
            "command": "cd " + host_script_location + "; ./host_ctrl.py {0} {1}".format(board_i2c_address, command),
            }

        command_ssh = "sshpass -p {password} ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null {user}@{host} \'{command}\'"
        print(command_ssh.format(**data))

        # command_no_ssh = 'py ../host_script_stub_{user}@{host}/host_ctrl.py {board_i2c_address} {action}'
        return_code = os.system(command_ssh.format(**data))
        return (return_code)

    def create(self, request):           
        return_code = self.push_cmd_ssh(request.data["action"], request.data["host_user"], request.data["host_ip_address"], request.data["host_password"], request.data["board_i2c_address"], request.data["host_script_location"])
        if return_code == 0:
            return Response()
        else:
            board = Board.objects.get(pk=request.data["board_id"])
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer, board)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, headers=headers)

    def perform_create(self, serializer, boards):
        serializer.save(board = boards)

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = Board_Log.objects.all()
        queryset2 = Board.objects.all()
        farm_id = self.request.query_params.get('farm_id', None)
        date = self.request.query_params.get('date', None)
        board_id = self.request.query_params.get('board_id', None)
        action = self.request.query_params.get('action', None)
        listId = []
        if farm_id is not None:
            queryset2 = queryset2.filter(farm_id=farm_id)
            for obj in queryset2:
                listId.append(obj.board_id)
        queryset = Board_Log.objects.all().filter(board_id__in=listId)
        if date is not None:
            if date != "All":
                queryset = queryset.filter(date=date)
        if board_id is not None:
            if board_id != "All":
                queryset = queryset.filter(board_id=board_id)   
        if action is not None:
            if action != "All":
                queryset = queryset.filter(action=action)
        return queryset


