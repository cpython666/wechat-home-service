# Generated by Django 4.2 on 2024-05-24 04:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("home", "0010_review_status_alter_order_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="realname",
            field=models.CharField(
                blank=True, max_length=15, null=True, verbose_name="真实姓名"
            ),
        ),
    ]
