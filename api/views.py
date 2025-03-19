from django.shortcuts import render
from rest_framework import generics, status
from .serialisers import RoomSerialiser, CreateRoomSerialiser, UpdateRoomSerialiser
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse


# Create your views here.
class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serialiser_class = RoomSerialiser


class CreateRoomView(APIView):
    serialiser_class = CreateRoomSerialiser

    def post(self, request, format=None):
        print(self.request.session.session_key + "\n\n\n\n")
        if not self.request.session.exists(self.request.session.session_key):
            print("Not existed")
            self.request.session.create()
        
        serialiser = self.serialiser_class(data=request.data)
        if serialiser.is_valid():
            guest_can_pause = serialiser.validated_data.get('guest_can_pause')
            votes_to_skip = serialiser.validated_data.get('votes_to_skip')
            print(f"Received guest_can_pause: {guest_can_pause}, votes_to_skip: {votes_to_skip}")  # 调试输出

            host_id = self.request.session.session_key
            queryset = Room.objects.filter(host=host_id)
            if queryset.exists():
                for room in queryset:
                    print(str(room) + "\n\n")
            else:
                print("queryset not existed")
            room_codes = Room.objects.values_list('code', flat=True)  # 获取所有的 code 字段
            print("before get room 所有的房间 code: ", list(room_codes))
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                room_codes = Room.objects.values_list('code', flat=True)  # 获取所有的 code 字段
                print("after get room 所有的房间 code: ", list(room_codes))
                return Response(RoomSerialiser(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host_id, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                room_codes_with_hosts = Room.objects.values('code', 'host')  # 获取每个 room 的 code 和对应的 host
                print("每个房间的 code 和 host: ", list(room_codes_with_hosts))
                return Response(RoomSerialiser(room).data, status=status.HTTP_201_CREATED)
            
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class GetRoom(APIView):
    serialiser_class = RoomSerialiser
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)

        room_codes = Room.objects.values_list('code', flat=True)  # 获取所有的 code 字段
        print("get room 所有的房间 code: ", list(room_codes))  # 打印所有的 code
        
        if code != None:
            room = Room.objects.filter(code=code)
            #print(str(room.query))
            if len(room) > 0:
                data = RoomSerialiser(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

 
class JoinRoom(APIView):
    lookup_url_kwarg = 'code'
    def post(self, request, format=None):
        print("hehhw")
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code = request.data.get(self.lookup_url_kwarg)
        room_codes = Room.objects.values_list('code', flat=True)  # 获取所有的 code 字段
        print("所有的房间 code: ", list(room_codes))  # 打印所有的 code
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)
            
            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)
                    
        return Response({'Bad Request': 'Invaild post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            code = self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete() # Review
        
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)


class UpdateRoom(APIView):
    serialiser_class = UpdateRoomSerialiser
    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serialiser = self.serialiser_class(data=request.data)
        if serialiser.is_valid():
            guest_can_pause = serialiser.data.get('guest_can_pause')
            votes_to_skip = serialiser.data.get('votes_to_skip')
            code = serialiser.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(RoomSerialiser(room).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST) # Review