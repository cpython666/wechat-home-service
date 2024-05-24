# Generated by Django 4.2 on 2024-05-23 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("home", "0007_alter_order_order_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="duration",
            field=models.IntegerField(
                blank=True, help_text="服务时长", null=True, verbose_name="服务持续时长"
            ),
        ),
        migrations.AlterField(
            model_name="order",
            name="start_time",
            field=models.DateTimeField(
                blank=True, null=True, verbose_name="订单开始时间"
            ),
        ),
    ]
