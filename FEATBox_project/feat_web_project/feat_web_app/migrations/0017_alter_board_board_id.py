# Generated by Django 3.2 on 2021-05-17 08:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feat_web_app', '0016_auto_20210513_1743'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board',
            name='board_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
