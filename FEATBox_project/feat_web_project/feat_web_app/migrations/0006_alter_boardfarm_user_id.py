# Generated by Django 3.2 on 2021-04-22 09:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('feat_web_app', '0005_auto_20210422_1635'),
    ]

    operations = [
        migrations.AlterField(
            model_name='boardfarm',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='feat_web_app.user'),
        ),
    ]
