# Generated by Django 3.2 on 2021-06-16 06:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feat_web_app', '0033_alter_board_log_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board_log',
            name='time',
            field=models.TimeField(default='13:53:36'),
        ),
    ]
