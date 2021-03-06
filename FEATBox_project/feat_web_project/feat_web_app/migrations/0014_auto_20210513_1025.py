# Generated by Django 3.2 on 2021-05-13 03:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feat_web_app', '0013_auto_20210505_1327'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='boardfarm',
            options={'managed': True},
        ),
        migrations.RenameField(
            model_name='board',
            old_name='farm_id',
            new_name='farm',
        ),
        migrations.RenameField(
            model_name='board_log',
            old_name='board_id',
            new_name='board',
        ),
        migrations.RenameField(
            model_name='boardfarm',
            old_name='user_id',
            new_name='user',
        ),
        migrations.AlterField(
            model_name='boardfarm',
            name='status',
            field=models.TextField(),
        ),
    ]
