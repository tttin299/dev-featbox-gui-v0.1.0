import React, { Component } from "react";
import { Button, Form, Col, Modal, Row } from 'react-bootstrap';


export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      
    };
  }
  
  
  onChange = (e) => {
    let { name, value } = e.target;
    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };


  render() {
    const { show, setShow, onSave } = this.props;
    return (
      // <h1>Hello</h1>
        <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>REMOVE BOARDFARM</Modal.Header>
        <Modal.Body> 
          <Form>
            <Form.Group as={Row} >
              <Form.Label column sm="4">USER NAME</Form.Label>
              <Col sm="8">
                <Form.Control plaintext readOnly defaultValue={this.state.activeItem.host_user} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} >
              <Form.Label column sm="4">IP ADDRESS</Form.Label>
              <Col sm="8">
                <Form.Control plaintext readOnly defaultValue={this.state.activeItem.host_ip_address} />
              </Col>
            </Form.Group>

            <p>
            ARE YOU SURE TO REMOVE THIS BOARDFARM?
            </p>

     
          </Form>
        </Modal.Body>
        
        <Modal.Footer >
              
          <Button variant="danger" onClick={() => onSave(this.state.activeItem)} href="#/">REMOVE</Button>{' '} 
        
          <Button variant="secondary" onClick={() => setShow(false)}>CANCEL</Button>
        

        </Modal.Footer>
        
      </Modal>
       
    );
  }
}