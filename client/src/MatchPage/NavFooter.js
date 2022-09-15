import React from 'react';
import { Navbar,  Container, Nav, NavDropdown} from 'react-bootstrap';


export class NavFooter extends React.Component {
    constructor(props) {
        super(props);
    }  

    render() {
        return (
            <div class="fixed-bottom container-fluid">
                <div class="row">
                    <div class="col-md-6">Copyright &nbsp;©&nbsp; 2020-2021 FaceOnLive</div>
                </div>
            </div>
        )
    }
}