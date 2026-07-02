import sys
sys.path.append('../')

import os
import gradio as gr
import json
import cv2
import requests
import numpy as np
from PIL import Image

from engine.header import *

file_path = os.path.abspath(__file__)
dir_path = os.path.dirname(file_path)
root_path = os.path.dirname(dir_path)

device_id = get_deviceid().decode('utf-8')
print_info('\t <Hardware ID> \t\t {}'.format(device_id))

css = """
.example-image img{
    display: flex; /* Use flexbox to align items */
    justify-content: center; /* Center the image horizontally */
    align-items: center; /* Center the image vertically */
    height: 300px; /* Set the height of the container */
    object-fit: contain; /* Preserve aspect ratio while fitting the image within the container */
}
.example-image img{
    display: flex; /* Use flexbox to align items */
    justify-content: center; /* Center the image horizontally */
    align-items: center; /* Center the image vertically */
    height: 300px; /* Set the height of the container */
    object-fit: contain; /* Preserve aspect ratio while fitting the image within the container */

.block-background {
    # background-color: #202020; /* Set your desired background color */
    border-radius: 5px;
}
}
"""

def find_key_in_dict(d, target_key):
  for key, value in d.items():
    if key == target_key:
      return value
    elif isinstance(value, dict):  # If the value is a dictionary, search recursively
      result = find_key_in_dict(value, target_key)
      if result is not None:
        return result
  return None

def json_to_html_table(data, image_keys):
  html = "<table border='1' style='border-collapse: collapse; width: 100%;'>"
  for key, value in data.items():
    if isinstance(value, dict):
      html += f"<tr><td colspan='2'><strong>{key}</strong></td></tr>"
      for sub_key, sub_value in value.items():
        if sub_key in image_keys:
          html += f"<tr><td>{sub_key}</td><td><img src='data:image/png;base64,{sub_value}' width = '200'  height= '100' /></td></tr>"
        else:
          html += f"<tr><td>{sub_key}</td><td>{sub_value}</td></tr>"
    else:
      if key in image_keys:
        html += f"<tr><td>{key}</td><td><img src='data:image/png;base64,{value}' width = '200'  height= '100' /></td></tr>"
      else:
        html += f"<tr><td>{key}</td><td>{value}</td></tr>"
      
  html += "</table>"
  return html

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

def idcard_recognition(frame1, frame2):
  global g_activation_result
  if g_activation_result != 0:
    gr.Warning("SDK Activation Failed!")
    return ['', None]

  image1, image2 = '', ''
  if frame1 is not None and frame2 is not None:
    image1, image2 = frame1, frame2
  elif frame1 is not None and frame2 is None:
    image1 = frame1
  elif frame1 is None and frame2 is not None:
    image1 = frame2
  elif frame1 is None and frame2 is None:
    raise gr.Error("Please select images files!")

  ocrResult = ocr_id_card(image1.encode('utf-8'), image2.encode('utf-8'))
  ocrResDict = json.loads(ocrResult)  
  images = None   
  rawValues = {}
  image_table_value = ""
  result_table_dict = {
    'portrait':'', 
    'documentName':'',
    'score':'',
    'countryName':'',
    'name':'', 
    'sex':'', 
    'address':'', 
    'dateOfBirth':'', 
    'dateOfIssue':'', 
    'dateOfExpiry':'',
    'documentNumber':'',
    }

  for key, value in ocrResDict.items():
    if key == 'image':
      for image_key, image_value in value.items():
        row_value = ("<tr>"
                      "<td>{key}</td>"
                      "<td><img src=""data:image/png;base64,{base64_image} width = '200'  height= '100' /></td>"
                    "</tr>".format(key=image_key, base64_image=image_value))
        image_table_value = image_table_value + row_value

  images = ("<table>"
            "<tr>"
              "<th>Field</th>"
              "<th>Image</th>"
            "</tr>"
            "{image_table_value}"
            "</table>".format(image_table_value=image_table_value))

  value = ocrResDict.copy()
  if 'image' in value:
    del value['image']
    rawValues = value
  else:
    rawValues = value

  
  for result_key in result_table_dict.keys():
    result_table_dict[result_key] =  find_key_in_dict(ocrResDict, result_key)
  
  result = json_to_html_table(result_table_dict, {'portrait'})
  json_result = json.dumps(rawValues, indent=6)
  return [result, json_result, images]
  
def launch_demo(activate_result):
  with gr.Blocks(css=css) as demo:
    with gr.Row():
      with gr.Column(scale=6):
        with gr.Row():
          with gr.Column(scale=3):
            id_image_input1 = gr.Image(type='filepath', label='Front', elem_classes="example-image")
          with gr.Column(scale=3):
            id_image_input2 = gr.Image(type='filepath', label='Back', elem_classes="example-image")
        
        with gr.Row():
          id_examples = gr.Examples(
            examples=[[os.path.join(root_path,'examples/1_f.png'), os.path.join(root_path, 'examples/1_b.png')], 
                      [os.path.join(root_path,'examples/2_f.png'), os.path.join(root_path, 'examples/2_b.png')], 
                      [os.path.join(root_path,'examples/3_f.png'), os.path.join(root_path, 'examples/3_b.png')], 
                      [os.path.join(root_path,'examples/4.png'), None]],
            inputs=[id_image_input1, id_image_input2],
            outputs=None,
            fn=idcard_recognition
          )
        
      with gr.Blocks():
        with gr.Column(scale=4, min_width=400, elem_classes="block-background"):     
          id_recognition_button = gr.Button("ID Card Recognition", variant="primary", size="lg")
          with gr.Tab("Key Fields"):
            id_result_output = gr.HTML()
          with gr.Tab("Raw JSON"):
            json_result_output = gr.JSON()
          with gr.Tab("Images"):
            image_result_output = gr.HTML()


      id_recognition_button.click(idcard_recognition, inputs=[id_image_input1, id_image_input2], outputs=[id_result_output, json_result_output, image_result_output])

  demo.launch(server_name="0.0.0.0", server_port=7860, show_api=False)

if __name__ == '__main__':
  g_activation_result = activate_sdk()
  launch_demo(g_activation_result)