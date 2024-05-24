# Generated by Django 4.1.13 on 2024-05-24 14:06

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("home", "0011_user_realname"),
    ]

    operations = [
        migrations.AddField(
            model_name="workerprofile",
            name="created_at",
            field=models.DateTimeField(
                auto_now_add=True,
                default=django.utils.timezone.now,
                verbose_name="创建时间",
            ),
            preserve_default=False,
        ),
    ]