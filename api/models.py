from django.db import models
import string
import random

def generate_unique_code(): 
    length = 6
    while True:
        room_codes = Room.objects.values_list('code', flat=True)  # 获取所有的 code 字段
        print("create 所有的房间 code: ", list(room_codes))  # 打印所有的 code
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break

    return code

# Create your models here.
class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=2)
    created_at = models.DateTimeField(auto_now_add=True)

    #def is_host_this(host)