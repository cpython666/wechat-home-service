# Generated by Django 4.2 on 2024-05-21 09:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("home", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="workerprofile",
            name="info",
            field=models.TextField(default="暂无介绍", verbose_name="介绍"),
        ),
    ]
