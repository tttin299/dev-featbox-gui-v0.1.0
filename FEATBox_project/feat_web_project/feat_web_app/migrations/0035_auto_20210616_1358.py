# Generated by Django 3.2 on 2021-06-16 06:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feat_web_app', '0034_alter_board_log_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board_log',
            name='time',
            field=models.TimeField(default='13:58:17'),
        ),
        migrations.AlterModelTable(
            name='board',
            table=None,
        ),
        migrations.AlterModelTable(
            name='board_log',
            table=None,
        ),
        migrations.AlterModelTable(
            name='boardfarm',
            table=None,
        ),
    ]
