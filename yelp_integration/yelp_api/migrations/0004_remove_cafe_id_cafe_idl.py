# Generated by Django 4.2.2 on 2023-07-10 15:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("yelp_api", "0003_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="cafe",
            name="id",
        ),
        migrations.AddField(
            model_name="cafe",
            name="idl",
            field=models.CharField(
                default=8, max_length=255, primary_key=True, serialize=False
            ),
            preserve_default=False,
        ),
    ]
