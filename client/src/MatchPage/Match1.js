import React from 'react';
import { View } from 'react-native';
import $ from "jquery";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {Table} from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import '../custom_loader.css';

import {SERVER_ADDR} from '../AppSetting'

const MySwal = withReactContent(Swal)

var g_id_result = 0;
var g_face_result = 0;
var g_portrait = ''
var g_match;
export class Match1 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {textData:'', imageData: '', faceAttrData:'', compareData:''}
        g_match = this;
    }

    componentDidMount() {
      $(document).ready(function () {
        $('#sidebarCollapse').on('click', function () {
            $('#sidebar').toggleClass('active');
            $(this).toggleClass('active');
        });
      });
    }

    PreviewIDImage = (event) => {
      g_id_result = 0
      g_match.setState({textData: '', imageData: '', compareData: ''});
      document.getElementById('dataTablediv_compare').style.display = "none";

      var str1 = document.getElementById('IDFile').value;
      var ext1 = str1.substring(str1.length - 3, str1.length).toString();
      var extext1 = ext1.toLowerCase();

      var str12 = document.getElementById('IDFile').value;
      var ext12 = str12.substring(str12.length - 9, str12.length).toString();
      var extext12 = ext12.toLowerCase();

      if (ext1 === "" && ext12 === "") {
        MySwal.fire({
            title: 'Warning',
            text: "Please Upload jpg/jpeg/png File",
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: "Ok"
          }) 
          return false;
      }

      if (extext1 === "jpg" || extext1 === "peg" || extext1 === "png" ) {
      }
      else {
        MySwal.fire({
            title: 'Warning',
            text: "Invalid File (please upload jpg/png/jpeg File)",
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: "Ok"
          }) 
          return false;
      }

      if (event.target.files && event.target.files[0]) {
          var ImageDir = new FileReader();
          ImageDir.onload = function (e) {
              $('#IDPrev').attr('src', e.target.result);
          }
          ImageDir.readAsDataURL(event.target.files[0]);
      }
    }

    PreviewFaceImage = (event) => {
      g_face_result = 0
      g_match.setState({faceAttrData: '', compareData: ''});
      document.getElementById('dataTablediv_compare').style.display = "none";

      var str1 = document.getElementById('FaceFile').value;
      var ext1 = str1.substring(str1.length - 3, str1.length).toString();
      var extext1 = ext1.toLowerCase();

      var str12 = document.getElementById('FaceFile').value;
      var ext12 = str12.substring(str12.length - 9, str12.length).toString();
      var extext12 = ext12.toLowerCase();

      if (ext1 === "" && ext12 === "") {
        MySwal.fire({
            title: 'Warning',
            text: "Please Upload jpg/jpeg/png File",
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: "Ok"
          }) 
          return false;
      }

      if (extext1 === "jpg" || extext1 === "peg" || extext1 === "png" ) {
      }
      else {
        MySwal.fire({
            title: 'Warning',
            text: "Invalid File (please upload jpg/png/jpeg File)",
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: "Ok"
          }) 
          return false;
      }

      if (event.target.files && event.target.files[0]) {
          var ImageDir = new FileReader();
          ImageDir.onload = function (e) {
              $('#FacePrev').attr('src', e.target.result);
          }
          ImageDir.readAsDataURL(event.target.files[0]);
      }
    }
    
    GetIDInfo = async() => {
        g_id_result = 0
        document.getElementById('dataTablediv_compare').style.display = "none";

        var img2 = document.getElementById("IDPrev").src;

        if (img2 != "") {
            $('#divLoader').show();
        }
        else {
            MySwal.fire({
            title: 'Warning',
            text: "please upload jpg/png/jpeg files",
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: "Ok"
            }) 
            return false;
        }

        var ext12 = img2.split(',')[1];
        var formdata = `{
            "image": "` + ext12 + `"
          }`;

        var url = SERVER_ADDR + '/ocr/idcard_base64';

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status === 200) {
                    var jsondata = JSON.parse(xhr.responseText);
                    console.log('json: ', jsondata)

                    var errorCode = jsondata.data.errorCode;

                    $('#divLoader').hide();
                    if (errorCode == 0) {
                        var textObj = {};
                        var imageObj = {};
                        for(var resKey in jsondata.data){

                            if(resKey == 'ghostPortrait' || resKey == 'signature' || resKey == 'portrait') {
                                if(resKey == 'portrait')
                                    g_portrait = jsondata.data[resKey]
                                imageObj[resKey] = jsondata.data[resKey]
                            } else {
                                textObj[resKey] = jsondata.data[resKey]
                            }
                        }

                        g_match.setState({textData: textObj, imageData: imageObj});
                        g_id_result = 1
                        if(g_id_result == 1 && g_face_result == 1) {
                            g_match.GetCompareInfo()
                        } else {
                            $('#divLoader').hide();
                            MySwal.fire({
                                title: 'Success',
                                text: "OCR Successful!",
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonText: "Ok"
                            })
                        }
                    }
                    else {
                        MySwal.fire({
                            title: 'Warning',
                            text: "OCR Failure! " + errorCode,
                            icon: 'error',
                            showCancelButton: false,
                            confirmButtonText: "Ok"
                        })
                    }
                }
                else {
                    $('#divLoader').hide();
                    MySwal.fire({
                        title: 'Error',
                        text: "Something went to wrong.Try again!! or Received Empty WebResponse",
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonText: "Ok"
                        })
                }
            }
        };
   
        xhr.send(formdata);
    }

    GetFaceInfo = async() => {
        g_face_result = 0
        document.getElementById('dataTablediv_compare').style.display = "none";

      var img2 = document.getElementById("FacePrev").src;
      if (img2 != "") {
          $('#divLoader').show();
      }
      else {
          MySwal.fire({
          title: 'Warning',
          text: "please upload jpg/png/jpeg files",
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: "Ok"
          }) 
          return false;
      }

      var ext12 = img2.split(',')[1];
      var formdata = `{
          "image": "` + ext12 + `"
        }`;

      var url = SERVER_ADDR + '/face/attribute_base64';

      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if(xhr.status === 200) {
                  var jsondata = JSON.parse(xhr.responseText);
                  console.log('json: ', jsondata)

                  var errorCode = jsondata.data.errorCode;

                  $('#divLoader').hide();

                  var faceAttrObj = {};
                  for(var resKey in jsondata.data){
                      if(resKey == 'angles') {
                        faceAttrObj['angles'] = 'pitch: ' + jsondata.data.angles['pitch'] + ', roll: ' + jsondata.data.angles['roll'] + ', yaw: ' + jsondata.data.angles['yaw'];
                      } else if(resKey == 'attr') {
                        faceAttrObj['attr'] = 'left_eye_open: ' + jsondata.data.attr['left_eye_open'] + ', right_eye_open: ' + jsondata.data.attr['right_eye_open'] + ', wear_glasses: ' + jsondata.data.attr['wear_glasses']
                      } else if(resKey == 'box') {
                        faceAttrObj['box'] = 'x: ' + jsondata.data.box['x'] + ', y: ' + jsondata.data.box['y'] + ', w: ' + jsondata.data.box['w'] + ', h: ' + jsondata.data.box['h']
                      } else {
                        faceAttrObj[resKey] = jsondata.data[resKey]
                      }
                  }

                  g_match.setState({faceAttrData:faceAttrObj});
                  g_face_result = 1;
                  if(g_id_result == 1 && g_face_result == 1) {
                    g_match.GetCompareInfo()
                  } else {
                      $('#divLoader').hide();
                      MySwal.fire({
                          title: 'Success',
                          text: "Face Processing Successful!",
                          icon: 'success',
                          showCancelButton: false,
                          confirmButtonText: "Ok"
                      })
                  }
              }
              else {
                  $('#divLoader').hide();
                  MySwal.fire({
                      title: 'Error',
                      text: "Something went to wrong.Try again!! or Received Empty WebResponse",
                      icon: 'error',
                      showCancelButton: false,
                      confirmButtonText: "Ok"
                      })
              }
          }
      };
 
      xhr.send(formdata);
  }

    GetCompareInfo = async() => {
        if(g_face_result == 0 || g_id_result == 0) {
            MySwal.fire({
                title: 'Warning',
                text: "Face Compare Failure! ",
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: "Ok"
            })
            return
        }

        var img1 = document.getElementById("FacePrev").src;
        if (img1 == "") {
            MySwal.fire({
                title: 'Warning',
                text: "Face Compare Failure! ",
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: "Ok"
            })

            return
        }

        $('#divLoader').show();

        var ext1 = img1.split(',')[1];
        var formdata = `{
          "image1": "` + ext1 + `", 
          "image2": "` + g_portrait + `"
        }`;

        var url = SERVER_ADDR + '/face/compare_base64';

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if(xhr.status === 200) {
                  var jsondata = JSON.parse(xhr.responseText);
                  console.log('json: ', jsondata)

                  var compareObj = {};
                  for(var resKey in jsondata.data){
                    compareObj[resKey] = jsondata.data[resKey]
                  }

                  g_match.setState({compareData:compareObj});

                  $('#divLoader').hide();
                  document.getElementById('dataTablediv_compare').style.display = "block";

                  if(jsondata.data.result == 'Same') {
                      MySwal.fire({
                          title: 'Result',
                          text: "ID Verified!",
                          icon: 'success',
                          showCancelButton: false,
                          confirmButtonText: "Ok"
                      })
                  } else {
                      MySwal.fire({
                          title: 'Result',
                          text: "ID Verify Failed!",
                          icon: 'error',
                          showCancelButton: false,
                          confirmButtonText: "Ok"
                      })
                  }
              }
              else {
                  $('#divLoader').hide();
                  MySwal.fire({
                      title: 'Error',
                      text: "Something went to wrong.Try again!! or Received Empty WebResponse",
                      icon: 'error',
                      showCancelButton: false,
                      confirmButtonText: "Ok"
                      })
              }
          }
        };

        xhr.send(formdata);
    }
    renderTextData() {
        return Object.keys(this.state.textData).map((key, i) => (
            <tr key={i}>
                <td>{key}</td>
                <td>{this.state.textData[key]}</td>
            </tr>
            )
        )
    }

    renderImageData() {
        return Object.keys(this.state.imageData).map((key, i) => (
            <tr key={i}>
                <td>{key}</td>
                <td> <img src={'data:image/png;base64,' + this.state.imageData[key]} width = '200'  height= '100' /> </td>
            </tr>
            )
        )
    }

    renderFaceAttrData() {
      return Object.keys(this.state.faceAttrData).map((key, i) => (
          <tr key={i}>
              <td>{key}</td>
              <td>{this.state.faceAttrData[key]}</td>
          </tr>
          )
      )
    }

    renderCompareData() {
      return Object.keys(this.state.compareData).map((key, i) => (
          <tr key={i}>
              <td>{key}</td>
              <td>{this.state.compareData[key]}</td>
          </tr>
          )
      )
    }

    render() {
        return (
            <View>
              <div class="container-fluid" >
                <div class="row justify-content-center mt-3">
                  <div class="col-md-6" >
                    <div class="box-shadow p-1 text-center">
                      <h5 class="font-weight-bold my-2"><i class="fas fa-image"></i>ID/Passport Image</h5>
                      <div class="left-img-outer mb-2">
                        <img id="IDPrev" class="img-fluid left-img-outer" />
                      </div>                      
                      <div class="row">
                          <div class="col">
                              <input type="file" id="IDFile" class="form-control" name="Probe_Image2" onChange={this.PreviewIDImage} accept=".png, .jpg, .jpeg"/>
                          </div>
                          <div class="col col-lg-2">
                              <input type="button" value="Upload" class="btn btn-primary" id="btnSubmit" onClick={this.GetIDInfo}/>                        
                          </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6" >
                    <div class="box-shadow p-1 text-center">
                      <h5 class="font-weight-bold my-2"><i class="fas fa-image"></i>Face Photo</h5>
                      <div class="left-img-outer mb-2">
                        <img id="FacePrev" class="img-fluid left-img-outer" />
                      </div>
                      <div class="row">
                          <div class="col">
                              <input type="file" id="FaceFile" class="form-control" name="Probe_Image2" onChange={this.PreviewFaceImage} accept=".png, .jpg, .jpeg"/>
                          </div>
                          <div class="col col-lg-2">
                              <input type="button" value="Upload" class="btn btn-primary" id="btnSubmit" onClick={this.GetFaceInfo}/>                        
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row justify-content-center mt-3">
                  <div class="col-md-8" >
                    <div class="p-3 dataTables_wrapper-overflow table-responsive border-box" id="dataTablediv_compare" style={{display:'none'}}>
                      <h5 class="text-thead font-weight-bold mb-3">Compare Result </h5>
                      <Table id="dataTable" >
                      <tbody>
                          {this.renderCompareData()}
                      </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
                <div class="row justify-content-center mt-3">
                  <div class="col-md-6" >
                    <div class="p-3 dataTables_wrapper-overflow table-responsive border-box" id="dataTablediv_ocr" style={{display:'block'}}>
                      <h5 class="text-thead font-weight-bold mb-3">OCR Result </h5>
                      <Table id="dataTable" >
                      <tbody>
                          {this.renderTextData()}
                          {this.renderImageData()}
                      </tbody>
                      </Table>
                    </div>
                  </div>
                  <div class="col-md-6" >
                    <div class="p-3 dataTables_wrapper-overflow table-responsive border-box" id="dataTablediv_face" style={{display:'block'}}>
                      <h5 class="text-thead font-weight-bold mb-3">Face Attribute Result </h5>
                      <Table id="dataTable" >
                      <tbody>
                          {this.renderFaceAttrData()}
                      </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>    
            </View>
        )
    }
}
	