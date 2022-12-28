# Generated by Django 4.1.4 on 2022-12-22 01:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify_api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=50)),
                ('can_pause', models.BooleanField(default=False)),
                ('votes_to_skip', models.IntegerField(default=1)),
                ('volume', models.FloatField(default=1)),
                ('requested_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.DeleteModel(
            name='Users',
        ),
    ]