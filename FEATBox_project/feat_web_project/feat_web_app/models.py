import datetime
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
# Create your models here.


class BoardFarm(models.Model):
    farm_id = models.AutoField(primary_key = True)
    user= models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created_date = models.DateField(auto_now_add=True)
    status = models.TextField(default='Unavailable')
    host_ip_address = models.TextField()
    host_user = models.TextField()
    host_password = models.TextField()
    class Meta:
            db_table = "boardfarm"

    def __str__(self):
        return " %s %s %s %s %s " % (self.farm_id, self.created_date, self.status, self.host_user, self.host_ip_address)



class Board(models.Model):
    board_id = models.AutoField(primary_key=True)
    farm= models.ForeignKey(BoardFarm, on_delete=models.CASCADE, null=True)
    board_i2c_address = models.TextField()
    board_name = models.TextField()
    power_status = models.BooleanField(default=False)
    switch_status = models.BooleanField(default=False)
    mode_status = models.BooleanField(default=False)
    class Meta:
            db_table = "board"

    def __str__(self):
        return " %s %s %s %s " % (self.board_id, self.farm_id, self.board_i2c_address, self.board_name)


class Board_Log(models.Model):
    board= models.ForeignKey(Board, on_delete=models.CASCADE, null=True)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    action = models.TextField()
    status = models.BooleanField(null =False, default=False)
    class Meta:
            db_table = "board_log"
            
    def __str__(self):
        return " %s %s %s %s %s " % (self.board_id, self.date, self.time, self.action, self.status)
