# Generated by Django 3.2 on 2021-06-17 14:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feat_web_app', '0039_auto_20210617_2125'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board',
            name='mode_status',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='board',
            name='power_status',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='board',
            name='switch_status',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='board_log',
            name='time',
            field=models.TimeField(default='21:28:04'),
        ),
    ]
