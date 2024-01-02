from fastapi import FastAPI, HTTPException, Depends, Header
from database import get_db, get_user_by_id, create_user, get_user_by_username
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from database import get_messages, create_message, get_all_users
from pydantic import BaseModel
from fastapi import WebSocket
from fastapi.encoders import jsonable_encoder

app = FastAPI()

origins = [
    "*"
]

# Разрешить все источники
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/users/{user_id}")
def get_user_endpoint(user_id: int, db=Depends(get_db), token : str = Header(None)):
    
    user = get_user_by_id(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get('/get-username/{user_id}')
def get_username_endpoint(user_id: int, db=Depends(get_db)):
    user = get_user_by_id(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.username

@app.get('/check-auth')
def check_auth_endpoint(username: str, password: str, db=Depends(get_db)):
    user = get_user_by_username(username, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.password != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user

@app.post("/users/")
def create_user_endpoint(username: str, password: str, db=Depends(get_db)):
    if len(username) < 4 or len(password) < 4 or len(username) > 30 or len(password) > 30:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    try:
        create_user(username, password, db)
        return {"username": username, "password": password}
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Username already registered")

@app.get("/me")
def get_messages_endpoint(id1 : int, id2 : int, db=Depends(get_db)):
    user_id1 = min(id1, id2)
    user_id2 = max(id1, id2)
    messages = get_messages(user_id1, user_id2, db)
    return messages

@app.get('/users')
def get_all_users_endpoint(db=Depends(get_db)):
    users = get_all_users(db)
    users = [user.__dict__ for user in users]
    print(users)
    # remove password from the response
    for user in users:
        del user["password"]
    return users

class Message(BaseModel):
    user_id1: int
    user_id2: int
    text: str
    author: int

@app.post("/me")
def send_message_endpoint(message: Message, db=Depends(get_db)):
    message.user_id1, message.user_id2 = min(message.user_id1, message.user_id2), max(message.user_id1, message.user_id2)
    create_message(message.user_id1, message.user_id2, message.text, message.author, db)

# WebSocket

active_connections = {}

@app.websocket('/me/ws/{user_id1}/{user_id2}')
async def websocket_endpoint(websocket: WebSocket, user_id1: int, user_id2: int, db=Depends(get_db)):
    user_id1, user_id2 = min(user_id1, user_id2), max(user_id1, user_id2)
    print('open connection with users:', user_id1, user_id2)
    if f'{user_id1}_{user_id2}' not in active_connections:
        active_connections[f'{user_id1}_{user_id2}'] = []
    await websocket.accept()
    active_connections[f'{user_id1}_{user_id2}'].append(websocket)
    try:
        while True:
            # Receive data from the client
            data = await websocket.receive_json()
            print(type (data))
            print(f'Received data: {data}')
            data['user_id1'], data['user_id2'] = min(data['user_id1'], data['user_id2']), max(data['user_id1'], data['user_id2'])
            message = Message(**data)
            print(f'Received data: {data}')
            # Send data to the client
            for connection in active_connections[f"{user_id1}_{user_id2}"]:
                await connection.send_json(jsonable_encoder(message))
            create_message(message.user_id1, message.user_id2, message.text, message.author, db)
    except Exception as e:
        print(f'Error: {e}')
    finally:
        active_connections[f'{user_id1}_{user_id2}'].remove(websocket)