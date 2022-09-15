import React from 'react';
import { View } from 'react-native';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { MatchPage1 } from './MatchPage';
import { MatchPage2 } from './MatchPage';
import { MatchPage3 } from './MatchPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './style.css';
import './custom_loader.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { alert } = this.props;

    return (
      <View>
        <BrowserRouter>
          <Switch>
            <Route path="/credit" component={MatchPage2} />
            <Route path="/barcode" component={MatchPage3} />
            <Route path="/" component={MatchPage1} />
            //<Redirect from="*" to="/" />
          </Switch>
        </BrowserRouter>
      </View>
    );
  }
}

