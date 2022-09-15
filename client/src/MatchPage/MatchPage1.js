import React from 'react';
import { View } from 'react-native';
import { Footer, Navbar,  Container, Nav, NavDropdown} from 'react-bootstrap';
import $ from "jquery";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import '../custom_loader.css';

import { NavHeader } from './NavHeader';
import { NavFooter } from './NavFooter';
import { Match1 } from './Match1';

export class MatchPage1 extends React.Component {
    constructor(props) {
        super(props);
    }    

    componentDidMount() {
        var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
        $('ul a').each(function () {
            if (this.href === path) {
                $(this).addClass('active');
            }
        });
    }

    render() {
        return (
            <View >
                <NavHeader/>

                <div id="divLoader" class="loader-bg" >
                    <div class="loader">
                    </div>
                </div>
                <div class="container-fluid" >
                    <div class="page-container mt-2">
                        <div>
                            <div class="wrapper">
                                <div id="content">
                                    <div class="content-wrap" >
                                        <Match1/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NavFooter/>
            </View>  
        )
    }
}
