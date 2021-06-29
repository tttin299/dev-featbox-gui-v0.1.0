import React, { Component } from "react";
import { Button, Form, Col, Modal, Row} from 'react-bootstrap';


export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      
    };
  }

  render() {
    const { show, setShow } = this.props;
    return (
        <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>PROFILE</Modal.Header>
        <Modal.Body> 
            
          <Form>
            <Form.Group as={Row} >
              <Form.Label column sm="4">User id</Form.Label>
              <Col sm="8">
                <Form.Control plaintext readOnly defaultValue={this.state.activeItem.user_id} />
              </Col>
              {/* <Form.Control 
                id="host_user_id"
                name="host_user"
                placeholder="Enter Host pc name" 
                value={this.state.activeItem.host_user}
                onChange={this.onChange}/> */}
            </Form.Group>

            <Form.Group as={Row} >
              <Form.Label column sm="4">User name</Form.Label>
              <Col sm="8">
                <Form.Control plaintext readOnly defaultValue={this.state.activeItem.user_name} />
              </Col>
              {/* <Form.Control 
                  type="text" 
                  id="host_ip_address_id"
                  name="host_ip_address"
                  placeholder="Enter ip address" 
                  value={this.state.activeItem.host_ip_address}
                  onChange={this.onChange}/> */}
            </Form.Group>


            <Form.Group as={Row} >
              <Form.Label column sm="4">Created date</Form.Label>
              <Col sm="8">
                <Form.Control plaintext readOnly defaultValue={this.state.activeItem.created_date} />
              </Col>

            </Form.Group>
          

          <Form.Group as={Row} >
              <Form.Label column sm="4">Email</Form.Label>
              <Col sm="8">
                <Form.Control plaintext readOnly defaultValue={this.state.activeItem.email} />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        
        <Modal.Footer className="center">
        <div className="center">
          {/* <Button variant="success" onClick={() => onSave(this.state.activeItem)}>OK</Button>{' '}  */}
        
          <Button variant="secondary" onClick={() => setShow(false)}>CANCEL</Button>
        </div>

        </Modal.Footer>
        
      </Modal>
       
    );
  }
}