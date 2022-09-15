#!/bin/sh

echo starting FaceOnLive Service
cd /home/ubuntu/FaceOnLive_v5_ocr/
#python3 ./app.py
/home/ubuntu/.local/bin/gunicorn -b 0.0.0.0:8000 app:app

#cd /root/frweb
#/root/miniconda3/envs/py36/bin/python ./waitress_server.py
