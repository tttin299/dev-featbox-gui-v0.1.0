import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/auth';
import { createMessage } from '../../actions/messages';
import { Button, Row, Col, Card, Form} from 'react-bootstrap';

export class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    password2: '',
  };

  static propTypes = {
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, password2 } = this.state;
    if (password !== password2) {
      this.props.createMessage({ passwordNotMatch: 'Passwords do not match' });
    } else {
      const newUser = {
        username,
        password,
        email,
      };
      this.props.register(newUser);
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    const { username, email, password, password2 } = this.state;
    return (
      <Col lg={{ span: 4, offset: 4 }}  md="auto">
        <Card className="p-3 mt-3">
          <Card.Body>
            <h2 className="text-center">Register</h2> 
            <Form  onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text"
                  name="username"
                  onChange={this.onChange}
                  value={username}
                />
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email"
                  name="email"
                  onChange={this.onChange}
                  value={email}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password"
                  name="password"
                  onChange={this.onChange}
                  value={password}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                  type="password"
                  className="form-control"
                  name="password2"
                  onChange={this.onChange}
                  value={password2}
                />
              </Form.Group>
              
              <Button variant="primary" type='submit' size='lg' block>REGISTER</Button>{' '}
           
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

// export default Register;
export default connect(mapStateToProps, { register, createMessage })(Register);