from django.db import models

# Create your models here.
class Session(models.Model):
    # username = models.CharField(max_length=30, default="", unique=True)
    password = models.CharField(max_length=50, unique=False)
    can_pause = models.BooleanField(null = False, default=False)
    votes_to_skip = models.IntegerField(null = False, default = 1)
    ##can_skip = models.BooleanField(null = False, default=False)
    ##can_queue = models.BooleanField(null = False, default=False)
    volume = models.FloatField(null = False, default = 1)
    requested_at = models.DateTimeField(auto_now_add=True)

    