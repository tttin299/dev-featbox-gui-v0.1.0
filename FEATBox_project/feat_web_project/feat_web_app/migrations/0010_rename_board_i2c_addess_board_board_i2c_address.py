# Generated by Django 3.2 on 2021-04-22 09:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feat_web_app', '0009_auto_20210422_1643'),
    ]

    operations = [
        migrations.RenameField(
            model_name='board',
            old_name='board_i2c_addess',
            new_name='board_i2c_address',
        ),
    ]
