import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { Navbar, Nav, Button, Form, Container, Row, Col, Image} from 'react-bootstrap' 
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from "./logo.png"
import Modal from "../modal/ModalAccount";
// import './logo.png';
// import img from './logo.png';
// import img from './logo.png';

export class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      activeItem: {
        user_id: "",
        user_name: "",
        created_date: "",
        email: ""
      },
    };
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
  };


  setShow = () => {
    this.setState({ modal: !this.state.modal });
  };


  showProfile = () => {
    const { user } = this.props.auth;
    const item = { user_id: user.id, user_name: user.username, created_date: user.date_joined, email: user.email };
    this.setState({ activeItem: item ,modal: !this.state.modal });
  };


  // showAdmin = () => {
  //   const { user } = this.props.auth;
  //   console.log()
  //   {user.is_superuser ? (
  //     <Nav.Link href="/admin">Administrator</Nav.Link>
  //   ):null}
  // }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (

      <Navbar >
        {/* <Nav className="ml-auto">
          <Nav.Item> */}
          <Row> 
          <strong>  
            <Nav.Link onClick={this.showProfile}>{user ? `${user.username}` : ''}</Nav.Link>
              {/* <div>   |   </div> */}
            {/* </Row>       */}
          </strong>
          {/* </Nav.Item>

          <Nav.Item> */}

          <Button variant="outline-primary" onClick={this.props.logout}>Sign out</Button>{' '}
          {/* </Nav.Item> className="ml-3" 
        </Nav> */}
        </Row>
      </Navbar>
    );

    const guestLinks = (
      <Navbar className="ml-auto">
          
        {/* <Nav >
          <Nav.Item>                          */}
            {/* <Nav.Link href="#login">Login</Nav.Link> */}
            <Button variant="outline-primary" href="#login">Login</Button>{' '}
          {/* </Nav.Item> */}

          {/* <Nav.Item>                     */}
            <Nav.Link href="#register">Register</Nav.Link>
          {/* </Nav.Item>
          </Nav> */}
  
      </Navbar>        
    );

    const showAdmin = (
      <Nav.Link onClick={this.showProfile}>{user ? (user.is_superuser ? (<Nav.Link href="/admin">Administrator</Nav.Link>) : ''): ''}</Nav.Link>
    )

    return (
      // <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <Navbar>
        <Container fluid>
          {/* <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button> */}
          <Navbar.Collapse id="responsive-navbar-nav">               
              {/* <Nav className="mr-auto">
                <Nav.Item> */}
                  {/* <img src={Jumbotron} alt='image' className="ml-3"/> */}
            <Row>
              <Col >
              {/* <img src={Jumbotron} alt='image' className="ml-3"/> */}
                <Image src={Jumbotron} />
              </Col>
              {/* </Nav.Item>

              <Nav.Item>  */}

              <Col>
                <Nav.Link href="#/">Home</Nav.Link>
              </Col>
            </Row>
              {/* </Nav.Item>

              <Nav.Item> */}
            {user ? (user.is_superuser ? (<Nav.Link href="/admin">Administrator</Nav.Link>) : null): null}
                {/* <Nav.Link href="/">Administrator</Nav.Link> */}
              {/* </Nav.Item>
            </Nav> */}
              
          </Navbar.Collapse>
          {isAuthenticated ? authLinks : guestLinks}

          {this.state.modal ? (
            <Modal
              activeItem={this.state.activeItem}
              show = {true}
              setShow={this.setShow}
              // onSave={this.onSubmit}
            />
          ) : null}
        </Container>
      </Navbar>
       
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);