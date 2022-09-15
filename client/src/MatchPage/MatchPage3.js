import React from 'react';
import { View } from 'react-native';
import $ from "jquery";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import '../custom_loader.css';

import { NavHeader } from './NavHeader';
import { NavFooter } from './NavFooter';
import { Match3 } from './Match3';

export class MatchPage3 extends React.Component {
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
            <View>
                <NavHeader/>
                <div id="divLoader" class="loader-bg">
                    <div class="loader">
                    </div>
                </div>
                <div class="container-fluid">
                    <div class="page-container mt-2">
                        <div>
                            <div class="wrapper">
                                <div id="content">
                                <div class="content-wrap">
                                    <Match3/>
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
