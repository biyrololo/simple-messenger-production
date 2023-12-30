import os

DATABASE_URL = os.getenv("DATABASE_URL")

from sqlalchemy import create_engine, text, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import IntegrityError

engine = create_engine(DATABASE_URL)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

def get_all_users(db):
    return db.query(User).all()

def get_user_by_id(user_id, db):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(username, db):
    return db.query(User).filter(User.username == username).first()

def create_user(username, password, db):
    user = User(username=username, password=password)
    db.add(user)
    db.commit()

class Message(Base):
    __tablename__ = "messages"
    user_id1 = Column(Integer, nullable=False)
    user_id2 = Column(Integer, nullable=False)
    id = Column(Integer, primary_key=True)
    text = Column(String, nullable=False)
    author = Column(Integer, nullable=False)

def create_message(user_id1, user_id2, text, author, db):
    message = Message(user_id1=user_id1, user_id2=user_id2, text=text, author=author)
    db.add(message)
    db.commit()

def get_messages(user_id1, user_id2, db):
    return db.query(Message).filter(Message.user_id1 == user_id1, Message.user_id2 == user_id2).all()

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()