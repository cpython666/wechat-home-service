# Generated by Django 4.2 on 2024-05-22 07:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("home", "0002_workerprofile_info"),
    ]

    operations = [
        migrations.AddField(
            model_name="workerprofile",
            name="qualification_document",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to="qualifications/",
                verbose_name="资质文件",
            ),
        ),
    ]
