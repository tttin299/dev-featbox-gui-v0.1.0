import React, { Component } from "react";
import { Button, Form, Col, Modal } from 'react-bootstrap';


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
        <Modal.Header closeButton>ADD NEW BOARDFARM INFORMATION</Modal.Header>
        <Modal.Body> 
          <Form>
            <Form.Group>
              <Form.Label>HOST PC NAME</Form.Label>
              <Form.Control 
                id="host_user_id"
                name="host_user"
                placeholder="Enter Host pc name" 
                value={this.state.activeItem.host_user}
                onChange={this.onChange}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>IP ADDRESS</Form.Label>
              <Form.Control 
                  type="text" 
                  id="host_ip_address_id"
                  name="host_ip_address"
                  placeholder="Enter ip address" 
                  value={this.state.activeItem.host_ip_address}
                  onChange={this.onChange}/>
            </Form.Group>


            <Form.Group>
              <Form.Label>SSH KEY</Form.Label>
              <Form.Control 
                  type="text" 
                  id="host_ssh_key_id"
                  name="host_ssh_key"
                  placeholder="Enter SSH_key" 
                  value={this.state.activeItem.host_ssh_key}
                  onChange={this.onChange}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        
        <Modal.Footer className="center">
        <div className="center">
          <Button variant="success" onClick={() => onSave(this.state.activeItem)}>OK</Button>{' '} 
        
          <Button variant="secondary" onClick={() => setShow(false)}>CANCEL</Button>
        </div>

        </Modal.Footer>
        
      </Modal>
       
    );
  }
}