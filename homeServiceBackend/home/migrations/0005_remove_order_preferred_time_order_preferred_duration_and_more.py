# Generated by Django 4.2 on 2024-05-23 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("home", "0004_order_order_id"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="order",
            name="preferred_time",
        ),
        migrations.AddField(
            model_name="order",
            name="preferred_duration",
            field=models.IntegerField(
                blank=True, null=True, verbose_name="预期服务时长"
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="preferred_endtime",
            field=models.TimeField(blank=True, null=True, verbose_name="首选时间"),
        ),
        migrations.AddField(
            model_name="order",
            name="preferred_starttime",
            field=models.TimeField(blank=True, null=True, verbose_name="首选时间"),
        ),
        migrations.AlterField(
            model_name="order",
            name="status",
            field=models.CharField(
                choices=[
                    ("待确认", "待确认"),
                    ("已确认", "已确认"),
                    ("服务人员开始服务", "服务人员开始服务"),
                    ("顾客确认开始服务", "顾客确认开始服务"),
                    ("进行中", "进行中"),
                    ("已完成", "已完成"),
                    ("已取消", "已取消"),
                ],
                default="pending",
                max_length=20,
                verbose_name="订单状态",
            ),
        ),
    ]
