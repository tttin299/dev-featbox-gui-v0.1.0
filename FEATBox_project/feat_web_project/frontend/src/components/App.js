
import ReactDOM from "react-dom";
import React, { Component, Fragment } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import Login from './accounts/Login';
import Register from './accounts/Register'
import Boards from './boards/Boards'
import Header from './layout/Header';
import Dashboard from './boardFarms/Dashboard';
import Alerts from './layout/Alerts';
import PrivateRoute from './common/PrivateRoute';

import { Provider } from 'react-redux';
import store from '../store';
import { loadUser } from '../actions/auth';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

// Alert Options
const alertOptions = {
  timeout: 3000,
  position: 'top center',
};

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      // <h1>Hello</h1>
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Fragment>
              <Header />
              <Alerts />
              {/* <Container> */}
                <Switch>
                  <PrivateRoute exact path="/" component={Dashboard} /> 
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/register" component={Register} />
                  <PrivateRoute path="/boardfarms" component={Boards} />
                </Switch>
              {/* </Container> */}
            </Fragment>
          </Router>
        </AlertProvider>
      </Provider> 
    );
  }
}
ReactDOM.render(<App />, document.getElementById('app'));

