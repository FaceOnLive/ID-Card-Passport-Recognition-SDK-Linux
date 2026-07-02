import sys
sys.path.append('../')

import os
import base64
import json
import uuid
import cv2
import numpy as np
from flask import Flask, request, jsonify
from time import gmtime, strftime

from engine.header import *

file_path = os.path.abspath(__file__)
dir_path = os.path.dirname(file_path)
root_path = os.path.dirname(dir_path)
dump_path = os.path.join(root_path, "flask/dump2/")

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super secret key'
app.config['SITE'] = "http://0.0.0.0:8000/"
app.config['DEBUG'] = False

device_id = get_deviceid().decode('utf-8')
print_info('\t <Hardware ID> \t\t {}'.format(device_id))

def activate_sdk():
  online_key = os.environ.get("LICENSE_KEY")
  offline_key_path = os.path.join(root_path, "license.txt")
  
  dict_path = os.path.join(root_path, "engine/bin")

  ret = -1
  if online_key is None:
    print_warning("Online license key not found!")
  else:
    print_info(f"LICENSE_KEY: {online_key}")
    activate_ret = set_activation(online_key.encode('utf-8')).decode('utf-8')
    ret = json.loads(activate_ret).get("errorCode", None)

  if ret == 0:
    print_log("Successfully online activation SDK!")
  else:
    print_error(f"Failed to online activation SDK, Error code {ret}\n Trying offline activation SDK...");
    if os.path.exists(offline_key_path) is False:
      print_warning("Offline license key file not found!")
      print_error(f"Falied to offline activation SDK, Error code {ret}")
      return ret
    else:
      file=open(offline_key_path,"r")
      offline_key = file.read()
      file.close()
      activate_ret = set_activation(offline_key.encode('utf-8')).decode('utf-8')
      ret = json.loads(activate_ret).get("errorCode", None)
      if ret == 0:
        print_log("Successfully offline activation SDK!")
      else:
        print_error(f"Falied to offline activation SDK, Error code {ret}")
        return ret
  
  init_ret = init_sdk(dict_path.encode('utf-8')).decode('utf-8')
  ret = json.loads(activate_ret).get("errorCode", None)
  print_log(f"Init SDK: {ret}")
  return ret


@app.route('/api/read_idcard', methods=['POST'])
def read_idcard():
  print(request.files)
  file1 = request.files['image']

  file_name1 = uuid.uuid4().hex[:6]
  save_path1 = dump_path + file_name1 + '_' + file1.filename
  file1.save(save_path1)

  file_path1 = os.path.abspath(save_path1)

  if 'image2' not in request.files:
    file_path2 = ''
  else:
    file2 = request.files['image2']

    file_name2 = uuid.uuid4().hex[:6]
    save_path2 = dump_path + file_name2 + '_' + file2.filename
    file2.save(save_path2)
    print(file2.filename)

    file_path2 = os.path.abspath(save_path2)


  ocrResult = ocr_id_card(file_path1.encode('utf-8'), file_path2.encode('utf-8'))
  ocrResDict = json.loads(ocrResult)  
  status = "ok"

  response = jsonify({"status": status, "data": ocrResDict})

  os.remove(file_path1)
  if 'image2' in request.files:
    os.remove(file_path2)

  response.status_code = 200
  response.headers["Content-Type"] = "application/json; charset=utf-8"
  return response

@app.route('/api/read_idcard_base64', methods=['POST'])
def read_idcard_base64():
  content = request.get_json()
  imageBase64 = content['image']

  file_name = uuid.uuid4().hex[:6]
  save_path = dump_path + file_name
  with open(save_path, "wb") as fh:
    fh.write(base64.b64decode(imageBase64))

  file_path = os.path.abspath(save_path)

  ocrResult = ocr_id_card(file_path.encode('utf-8'), ''.encode('utf-8'))
  ocrResDict = json.loads(ocrResult)
  status = "ok"

  response = jsonify({"status": status, "data": ocrResDict})

  os.remove(file_path)

  response.status_code = 200
  response.headers["Content-Type"] = "application/json; charset=utf-8"
  return response


@app.route('/api/read_credit', methods=['POST'])
def read_credit():
  file = request.files['image']
  print('read_credit ', file)

  image = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_COLOR)
  file_name = uuid.uuid4().hex[:6]
  save_path = dump_path + file_name + '.png'
  cv2.imwrite(save_path, image)

  file_path = os.path.abspath(save_path)

  ocrResult = ocr_credit_card(file_path.encode('utf-8'))
  ocrResDict = json.loads(ocrResult)
  status = "ok"

  response = jsonify({"status": status, "data": ocrResDict})

  os.remove(file_path)

  response.status_code = 200
  response.headers["Content-Type"] = "application/json; charset=utf-8"
  return response

@app.route('/api/read_credit_base64', methods=['POST'])
def read_credit_base64():
  print('read_credit_base64');
  content = request.get_json()
  imageBase64 = content['image']
  image = cv2.imdecode(np.frombuffer(base64.b64decode(imageBase64), dtype=np.uint8), cv2.IMREAD_COLOR)

  file_name = uuid.uuid4().hex[:6]
  save_path = dump_path + file_name + '.png'
  cv2.imwrite(save_path, image)

  file_path = os.path.abspath(save_path)

  ocrResult = ocr_credit_card(file_path.encode('utf-8'))
  ocrResDict = json.loads(ocrResult)
  status = "ok"

  response = jsonify({"status": status, "data": ocrResDict})

  os.remove(file_path)

  response.status_code = 200
  response.headers["Content-Type"] = "application/json; charset=utf-8"
  return response

@app.route('/api/read_barcode', methods=['POST'])
def read_barcode():
  file = request.files['image']
  print('read_barcode ', file)

  image = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_COLOR)
  file_name = uuid.uuid4().hex[:6]
  save_path = dump_path + file_name + '.png'
  cv2.imwrite(save_path, image)

  file_path = os.path.abspath(save_path)

  ocrResult = ocr_barcode(file_path.encode('utf-8'))
  ocrResDict = json.loads(ocrResult)
  status = "ok"

  response = jsonify({"status": status, "data": ocrResDict})

  os.remove(file_path)

  response.status_code = 200
  response.headers["Content-Type"] = "application/json; charset=utf-8"
  return response

@app.route('/api/read_barcode_base64', methods=['POST'])
def read_barcode_base64():
  content = request.get_json()
  imageBase64 = content['image']
  image = cv2.imdecode(np.frombuffer(base64.b64decode(imageBase64), dtype=np.uint8), cv2.IMREAD_COLOR)

  file_name = uuid.uuid4().hex[:6]
  save_path = dump_path + file_name + '.png'
  cv2.imwrite(save_path, image)

  file_path = os.path.abspath(save_path)
  print('file_path: ', file_path)

  ocrResult = ocr_barcode(file_path.encode('utf-8'))
  ocrResDict = json.loads(ocrResult)
  status = "ok"

  response = jsonify({"status": status, "data": ocrResDict})

  os.remove(file_path)

  response.status_code = 200
  response.headers["Content-Type"] = "application/json; charset=utf-8"

  return response

if __name__ == '__main__':
  ret = activate_sdk()
  if ret != 0:
    exit(-1)

  port = int(os.environ.get("PORT", 8000))
  app.run(host='0.0.0.0', port=port)