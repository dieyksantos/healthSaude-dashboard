#!/bin/bash
cd backend
pip3 install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port $PORT
