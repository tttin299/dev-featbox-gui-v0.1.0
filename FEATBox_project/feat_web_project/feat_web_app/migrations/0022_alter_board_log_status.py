# Generated by Django 3.2 on 2021-06-11 10:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feat_web_app', '0021_rename_host_ssh_key_boardfarm_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board_log',
            name='status',
            field=models.BooleanField(default=False),
        ),
    ]
