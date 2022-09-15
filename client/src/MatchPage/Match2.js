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

var g_match2;
export class Match2 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {textData:'', imageData: ''}
        g_match2 = this;
    }

    componentDidMount() {
      $(document).ready(function () {
        $('#sidebarCollapse').on('click', function () {
            $('#sidebar').toggleClass('active');
            $(this).toggleClass('active');
        });
      });
    }

    ShowPreview2 = (event) => {

      document.getElementById('dataTablediv').style.display = "none";
      var str1 = document.getElementById('FaceFile2').value;
      var ext1 = str1.substring(str1.length - 3, str1.length).toString();
      var extext1 = ext1.toLowerCase();

      var str12 = document.getElementById('FaceFile2').value;
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

      if (extext1 === "jpg" || extext1 === "peg" || extext1 === "png") {
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
              $('#impPrev2').attr('src', e.target.result);
          }
          ImageDir.readAsDataURL(event.target.files[0]);
      }
    }


    Getface = async() => {
        var img2 = document.getElementById("impPrev2").src;

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

        var url = SERVER_ADDR + '/ocr/credit_base64';

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
                                imageObj[resKey] = jsondata.data[resKey]
                            } else {
                                textObj[resKey] = jsondata.data[resKey]
                            }
                        }

                        g_match2.setState({textData: textObj, imageData: imageObj});

                        document.getElementById('dataTablediv').style.display = "block";
                        $('#divLoader').hide();
                        MySwal.fire({
                            title: 'Success',
                            text: "OCR Successful!",
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonText: "Ok"
                        })
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
    render() {
        return (
            <View>
              <div class="container-fluid">
                <div class="row justify-content-center mt-3">
                  <div class="col-md-6">
                    <div class="box-shadow p-1 text-center">
                      <h4 class="font-weight-bold my-2"><i class="fas fa-image"></i> Credit Card Recognition</h4>
                      <div class="left-img-outer mb-2">
                        <img id="impPrev2" class="img-fluid left-img-outer" />
                      </div>
                        <div className="row">
                            <div className="col">
                                <input type="file" id="FaceFile2" className="form-control" name="Probe_Image2"
                                       onChange={this.ShowPreview2} accept=".png, .jpg, .jpeg"/>
                            </div>
                            <div className="col col-lg-2">
                                <input type="button" value="Upload" className="btn btn-primary" id="btnSubmit"
                                       onClick={this.Getface}/>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div class="p-3 dataTables_wrapper-overflow table-responsive border-box" id="dataTablediv" style={{display:'none'}}>
                    <h5 class="text-thead font-weight-bold mb-3">OCR Result </h5>
                        <Table id="dataTable" >
                        <tbody>
                            {this.renderTextData()}
                            {this.renderImageData()}
                        </tbody>
                        </Table>
                  </div>
                </div>
              </div>    
            </View>
        )
    }
}
	