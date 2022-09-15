import React from 'react';
import { Navbar,  Container, Nav, NavDropdown} from 'react-bootstrap';


export class NavHeader extends React.Component {
    constructor(props) {
        super(props);
    }  

    render() {
        return (
            <Navbar style={{backgroundColor:'#7a7bA7'}} expand="lg" sticky="top" >
                <Container>
                    <Navbar.Brand href="https://www.faceonlive.com"><img width="214" height="36" src="https://faceonlive.com/wp-content/uploads/2021/05/logo-1.svg" class="attachment-full size-full" alt="" loading="lazy"/></Navbar.Brand>
                    <Nav className="justify-content-end">
                        <Nav.Link href="/" style={{color:'white'}}>ID Verification</Nav.Link>
                        <Nav.Link href="/credit" style={{color:'white'}}>Credit Card Recognition</Nav.Link>
                        <Nav.Link href="/barcode" style={{color:'white'}}>Barcode/QR Code Recognition</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>             
        )
    }
}