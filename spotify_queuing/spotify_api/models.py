from django.db import models
import string
import random


def generate_unique_password():
    length = 6
    while True:
        password = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Session.objects.filter(password=password).count() == 0:
            break
    return password


# Create your models here.
class Session(models.Model):
    host = models.CharField(max_length=30, default='RixRadio', unique=False)
    password = models.CharField(
        max_length=8, default=generate_unique_password, unique=True)
    can_pause = models.BooleanField(null = False, default=False)
    votes_to_skip = models.IntegerField(null = True, default = 1)
    ##can_skip = models.BooleanField(null = False, default=False)
    ##can_queue = models.BooleanField(null = False, default=False)
    volume = models.FloatField(null = False, default = 1)
    requested_at = models.DateTimeField(auto_now_add=True) 

    