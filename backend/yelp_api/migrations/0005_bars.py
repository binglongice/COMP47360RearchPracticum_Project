# Generated by Django 4.2.3 on 2023-08-03 12:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yelp_api', '0004_remove_monthlypredictions_week_of_year'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bars',
            fields=[
                ('id', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=255)),
                ('rating', models.DecimalField(decimal_places=1, max_digits=3)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('image_url', models.CharField(max_length=255, null=True)),
            ],
            options={
                'db_table': 'bars',
            },
        ),
    ]
