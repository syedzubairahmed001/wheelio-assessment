from typing import Optional, List
from enum import Enum

from pydantic import ConfigDict, BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator

from typing_extensions import Annotated

from bson import ObjectId
import motor.motor_asyncio
from pymongo import ReturnDocument


# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]


class UserModel(BaseModel):

    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    email: Optional[EmailStr] = Field(...)
    username: Optional[str] = Field(...)
    status: Optional[str] = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "email": "jdoe@example.com",
                "username": "jane_doe",
                "status": "hello!"
            }
        },
    )



class UserRelationsModel(BaseModel):

    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    fromUserId: Optional[str] = Field(...)
    toUserId: Optional[str] = Field(...)
    relationStatus: Optional[str] = Field(...)
    isUserSeen: Optional[bool] = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )


class UserUpdatesModel(BaseModel):
    
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    userId: Optional[PyObjectId] = Field(...)
    status: Optional[str] = Field(...)
    isUserSeen: Optional[bool] = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )


