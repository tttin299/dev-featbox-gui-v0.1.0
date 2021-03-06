# Generated by Django 3.2 on 2021-06-17 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feat_web_app', '0038_auto_20210617_2117'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board',
            name='mode_status',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name='board',
            name='power_status',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name='board',
            name='switch_status',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name='board_log',
            name='time',
            field=models.TimeField(default='21:25:38'),
        ),
    ]
