# Generated by Django 3.2 on 2021-05-13 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feat_web_app', '0015_auto_20210513_1123'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='boardfarm',
            options={},
        ),
        migrations.AlterField(
            model_name='board',
            name='board_id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
