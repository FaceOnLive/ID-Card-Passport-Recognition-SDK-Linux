import gradio as gr
import requests
import json
from PIL import Image

def idcard_recognition(frame1, frame2):
    url = "http://127.0.0.1:8000/ocr/idcard"
    files = None
    if frame1 is not None and frame2 is not None:
        files = {'image1': open(frame1, 'rb'), 'image2': open(frame2, 'rb')}
    elif frame1 is not None and frame2 is None:
        files = {'image1': open(frame1, 'rb')}
    elif frame1 is None and frame2 is not None:
        files = {'image1': open(frame2, 'rb')}
    else:
        return ['', None]

    print(frame1, files)
    r = requests.post(url=url, files=files)

    images = None   
    resultValues = {}
    table_value = ""
    for key, value in r.json().items():

        if key == 'data':
            if 'image' in value:
                del value['image']
            resultValues[key] = value
        else:
            resultValues[key] = value


    if 'data' in r.json():
        for key, value in r.json()['data'].items():
            if key == 'image':
                for image_key, image_value in value.items():
                    row_value = ("<tr>"
                                    "<td>{key}</td>"
                                    "<td><img src=""data:image/png;base64,{base64_image} width = '200'  height= '100' /></td>"
                                "</tr>".format(key=image_key, base64_image=image_value))
                    table_value = table_value + row_value

        images = ("<table>"
                    "<tr>"
                        "<th>Field</th>"
                        "<th>Image</th>"
                    "</tr>"
                    "{table_value}"
                    "</table>".format(table_value=table_value))
    
    json_result = json.dumps(resultValues, indent=4)
    return [json_result, images]

def barcode_recognition(frame):
    url = "http://127.0.0.1:8000/ocr/barcode"
    files = None
    if frame is None:
        return ['', None]

    files = {'image': open(frame, 'rb')}
    r = requests.post(url=url, files=files)

    images = None   
    resultValues = {}
    table_value = ""
    for key, value in r.json().items():

        if key == 'data':
            if 'image' in value:
                del value['image']
            resultValues[key] = value
        else:
            resultValues[key] = value


    if 'data' in r.json():
        for key, value in r.json()['data'].items():
            if key == 'image':
                for image_key, image_value in value.items():
                    row_value = ("<tr>"
                                    "<td>{key}</td>"
                                    "<td><img src=""data:image/png;base64,{base64_image} width = '200'  height= '100' /></td>"
                                "</tr>".format(key=image_key, base64_image=image_value))
                    table_value = table_value + row_value

        images = ("<table>"
                    "<tr>"
                        "<th>Field</th>"
                        "<th>Image</th>"
                    "</tr>"
                    "{table_value}"
                    "</table>".format(table_value=table_value))
    
    json_result = json.dumps(resultValues, indent=4)
    return [json_result, images]

def credit_recognition(frame):
    url = "http://127.0.0.1:8000/ocr/credit"
    files = None
    if frame is None:
        return ['', None]

    files = {'image': open(frame, 'rb')}
    r = requests.post(url=url, files=files)

    images = None   
    resultValues = {}
    table_value = ""
    for key, value in r.json().items():

        if key == 'data':
            if 'image' in value:
                del value['image']
            resultValues[key] = value
        else:
            resultValues[key] = value


    if 'data' in r.json():
        for key, value in r.json()['data'].items():
            if key == 'image':
                for image_key, image_value in value.items():
                    row_value = ("<tr>"
                                    "<td>{key}</td>"
                                    "<td><img src=""data:image/png;base64,{base64_image} width = '200'  height= '100' /></td>"
                                "</tr>".format(key=image_key, base64_image=image_value))
                    table_value = table_value + row_value

        images = ("<table>"
                    "<tr>"
                        "<th>Field</th>"
                        "<th>Image</th>"
                    "</tr>"
                    "{table_value}"
                    "</table>".format(table_value=table_value))
    
    json_result = json.dumps(resultValues, indent=4)
    return [json_result, images]

with gr.Blocks() as demo:
    gr.Markdown(
        """
    # ID Document Recognition
    Get your own ID Document Recognition Server by duplicating this space.<br/>
    Contact us at contact@faceonlive.com for issues and support.<br/>
    """
    )
    with gr.TabItem("ID Card Recognition"):
        with gr.Row():
            with gr.Column(scale=3):
                id_image_input1 = gr.Image(type='filepath', label='Front')
                id_image_input2 = gr.Image(type='filepath', label='Back')
                id_recognition_button = gr.Button("ID Card Recognition")
            with gr.Column(scale=5):
                id_result_output = gr.JSON()
        
            with gr.Column(scale=2):
                image_result_output = gr.HTML()

        id_recognition_button.click(idcard_recognition, inputs=[id_image_input1, id_image_input2], outputs=[id_result_output, image_result_output])
    with gr.TabItem("Barcode Recognition"):
        with gr.Row():
            with gr.Column(scale=3):
                barcode_image_input = gr.Image(type='filepath')
                barcode_recognition_button = gr.Button("Barcode Recognition")
            with gr.Column(scale=5):
                barcode_result_output = gr.JSON()
        
            with gr.Column(scale=2):
                image_result_output = gr.HTML()
        
        barcode_recognition_button.click(barcode_recognition, inputs=barcode_image_input, outputs=[barcode_result_output, image_result_output])

    with gr.TabItem("Credit Card Recognition"):
        with gr.Row():
            with gr.Column(scale=3):
                credit_image_input = gr.Image(type='filepath')
                credit_recognition_button = gr.Button("Credit Card Recognition")
            with gr.Column(scale=5):
                credit_result_output = gr.JSON()
        
            with gr.Column(scale=2):
                image_result_output = gr.HTML()
        
        credit_recognition_button.click(credit_recognition, inputs=credit_image_input, outputs=[credit_result_output, image_result_output])

demo.launch(server_name="0.0.0.0", server_port=7860)