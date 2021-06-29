import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import { Button, Row, Col, Card, Image, Form} from 'react-bootstrap';

// feat_web_project\frontend\static\frontend\a23e65158df94b68dfc8cb77f372087a.png
export class Login extends Component {
  state = {
    username: '',
    password: '',
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.login(this.state.username, this.state.password);
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    const { username, password } = this.state;
    return (
     
      <Col lg={{ span: 4, offset: 4 }}  md={{ span: 6, offset: 4 }} >
        <Card className="p-3 mt-3">
          <Card.Body>    
            <h2 className="text-center">Log In</h2>
            <Form  onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text"
                  required
                  name="username"
                  onChange={this.onChange}
                  value={username}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password"
                  required
                  name="password"
                  onChange={this.onChange}
                  value={password}
                />
              </Form.Group>
              
              <Button variant="primary" type='submit' size='lg' block >LOGIN</Button>{' '}
            </Form>
          </Card.Body>
        </Card>
    </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

// export default Login;
export default connect(mapStateToProps, { login })(Login);