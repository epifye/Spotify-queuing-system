# Generated by Django 4.1.4 on 2022-12-24 00:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify_api', '0003_session_host_alter_session_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='host',
            field=models.CharField(default='RixRadio', max_length=30, unique=True),
        ),
    ]
