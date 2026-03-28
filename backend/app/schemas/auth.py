from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class AdminCreate(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    id: str
    username: str
    last_login_at: Optional[datetime] = None
    
    class Config: 
        from_attributes = True
