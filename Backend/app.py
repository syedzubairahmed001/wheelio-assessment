import os
from typing import Optional, List

import logging
import sys


from fastapi import FastAPI, Body, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import ConfigDict, BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator

from typing_extensions import Annotated

from bson import ObjectId
import motor.motor_asyncio
from pymongo import ReturnDocument


from sockets import sio_app

from models import UserModel, UserRelationsModel, UserUpdatesModel

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)



app = FastAPI()



origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client.wheelio
user_collection = db.get_collection("users")
user_relation_collection = db.get_collection("userrelations")


class RelationStatusRequestBody(BaseModel): 
    fromUserId: str
    toUserId: str

class GetFriendRequestBody(BaseModel): 
    userId: str

class UserCollection(BaseModel):
    users: List[UserModel]
class UserRelationCollection(BaseModel):
    relations: List[UserRelationsModel]
    users: List[UserModel]

@app.post(
    "/user",
    response_description="Join user",
    response_model=UserModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def join_user(user: UserModel = Body(...)):
    logger.debug(user.email)

    existing_user = await user_collection.find_one({"$or": [{"email": user.email}, {"username": user.username}]})

    if(existing_user):
        return existing_user

    new_user = await user_collection.insert_one(
        user.model_dump(by_alias=True, exclude=["id"])
    )
    created_user = await user_collection.find_one(
        {"_id": new_user.inserted_id}
    )
    return created_user

@app.get(
    "/user",
    response_description="Get all users",
    response_model=UserCollection,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,
)
async def get_all_users():
    return UserCollection(users=await user_collection.find().to_list(1000))



@app.post(
    "/send-friend-request",
    response_description="send-friend-request",
    response_model=UserRelationsModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def send_friend_request(userRelation: UserRelationsModel = Body(...)):
    new_relation = await user_relation_collection.insert_one(
        userRelation.model_dump(by_alias=True, exclude=["id"])
    )
    created_relation = await user_relation_collection.find_one(
        {"_id": new_relation.inserted_id}
    )
    return created_relation

@app.post(
    "/friend-request",
    response_description="get-friend-request",
    response_model=UserRelationCollection,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def get_friend_request(data: GetFriendRequestBody = Body(...)):

    existing_relations = await user_relation_collection.find(
        {"toUserId": data.userId}
    )
    userIds = [i["fromUserId"] for i in existing_relations]
    users = await user_collection.find({"_id": {"$in": userIds}})
    return UserRelationCollection(relations=existing_relations, users=users)



@app.post(
    "/relation-status",
    response_description="relation-status",
    response_model=UserRelationsModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def get_relation_status(data: RelationStatusRequestBody):

    relation = await user_relation_collection.find_one(
        {"fromUserId": data.fromUserId, "toUserId": data.toUserId}
    )
    return relation

app.mount('/', app=sio_app)