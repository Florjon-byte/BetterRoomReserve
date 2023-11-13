#!/usr/bin/python3
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


origins = [
    "http://localhost:3000"
]
sys.path.append("../../databases")
import dbMethods as db

# Connect to your postgres DB
conn = psycopg2.connect("dbname=betterroomreserve user=postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT);
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = FastAPI()

@app.get("/api")
def read_root():
    return {"Hello": "World"}

@app.get("/home")
def post_test_data():
    cur, conn = db.openCursor()
    query = "SELECT * FROM user_data WHERE net_id = 'dg3314'"
    cur.execute(query)
    results = cur.fetchall()
    db.commitAndClose(cur, conn)
    return results

@app.get("/reserve")
def read_root():
    return {"Hello": "World"}

@app.get("/profile")
def read_root():
    return {"Hello": "World"}

@app.get("/login")
def authenticate_user():
    return {"Hello": "World"}

