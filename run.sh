#!/bin/bash

exec ./ocrengine/ttvocrsrv &
exec python3 app.py &
exec python3 demo.py