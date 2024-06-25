import socketio

import logging


logger = logging.getLogger('uvicorn.error')



sio_server = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=[]
)

sio_app = socketio.ASGIApp(
    socketio_server=sio_server,
    socketio_path='socket.io'
)

connected_users = {}


@sio_server.event
async def connect(sid, environ, auth):
    connected_users[sid] = True
    await sio_server.emit('join', {'sid': sid})


@sio_server.event
async def register(sid, user_object):
    await sio_server.enter_room(sid, user_object["id"])
    logger.debug(user_object["id"])


@sio_server.event
async def send_friend_request(sid, data):
    fromname = data["from"]
    to_user = data["toUserId"]
    logger
    await sio_server.emit('get_friend_request', {"username": fromname}, room=to_user)


@sio_server.event
async def disconnect(sid):
    print(f'{sid}: disconnected')

