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

    def push_cmd_ssh(self, command, host_user, host_ip_address, host_password):
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        # data = { 
        #         "user": host_user,
        #         "password": host_password,
        #         "host": host_ip_address,
        #         "command": '''rm -rf -- feat_database.json ; echo '{ "database": "db_featweb", "host": "10.222.244.189", "port": "3306", "username": "root","password": "1234"}' > feat_database.json'''
        #         }
        
        # command_ssh = "sshpass -p {password} ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null {user}@{host} {command}"
        # return_code = os.system(command_ssh.format(**data))
        
        command_no_ssh_linux = 'echo { //""database"//": //""db_featweb"//", //""host"//": //""' + local_ip + '"//", //""port"//": //""3306"//", //""username"//": //""root"//",//""password"//": //""1234"//"} > ../host_script_stub_'+ host_user +'@'+ host_ip_address + '/feat_database.json'
        # command_no_ssh = 'echo { "database": "db_featweb", "host": "' + local_ip + '", "port": "3306", "username": "root","password": "1234"} > ../host_script_stub_'+ host_user +'@'+ host_ip_address + '/feat_database.json'
 
        return_code = os.system(command_no_ssh_linux)
        if return_code == 0:
            data = { 
                "user": host_user,
                "password": host_password,
                "host": host_ip_address,
                "command": "cd host_script_stub; ./host_ctrl.py {0}".format(command),
                }
            # command_ssh = "sshpass -p {password} ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null {user}@{host} {command}"
            # return_code = os.system(command_ssh.format(**data))

            command_no_ssh = 'python host_script_stub_'+ host_user +'@'+host_ip_address+'/host_ctrl.py ' + command 
            return_code = os.system(command_no_ssh)
            if return_code != 0:
                return (return_code)
            return 0
            
    def get_queryset(self):
        for obj in BoardFarm.objects.all():
            return_code = self.push_cmd_ssh("status", obj.host_user, obj.host_ip_address, obj.host_password)
        return BoardFarm.objects.all();

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        print(serializer)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return_code = self.push_cmd_ssh("init", request.data["host_user"], request.data["host_ip_address"], request.data["host_password"]) 
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

    def push_cmd_ssh(self, command, host_user, host_ip_address, host_password, board_i2c_address):
        data = { 
            "user": host_user,
            "host": host_ip_address,
            "password": host_password,
            "board_i2c_address": board_i2c_address,
            "action": command,
            "command": "cd host_script_stub; ./host_ctrl.py {0} {1}".format(board_i2c_address, command),
            }

        # command_ssh = "sshpass -p {password} ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null {user}@{host} {command}"
        # return_code = os.system(command_ssh.format(**data))

        command_no_ssh = 'python host_script_stub_{user}@{host}/host_ctrl.py {board_i2c_address} {action}'
        return_code = os.system(command_no_ssh.format(**data))
        return (return_code)

    def create(self, request):           
        return_code = self.push_cmd_ssh(request.data["action"], request.data["host_user"], request.data["host_ip_address"], request.data["host_password"], request.data["board_i2c_address"])
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


