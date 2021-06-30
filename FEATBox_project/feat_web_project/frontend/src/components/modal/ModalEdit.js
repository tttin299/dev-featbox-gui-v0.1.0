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
        <Modal.Header closeButton>EDIT BOARDFARM INFORMATION</Modal.Header>
        <Modal.Body> 
          <Form>
            <Form.Group>
              <Form.Label>USER NAME</Form.Label>
              <Form.Control 
                id="host_user_id"
                name="host_user"
                placeholder="Enter user name" 
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
              <Form.Label>PASSWORD</Form.Label>
              <Form.Control 
                  type="password"  
                  id="host_ip_pass_id"
                  name="host_password"
                  placeholder="Enter password" 
                  value={this.state.activeItem.host_password}
                  onChange={this.onChange}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>PASSWORD</Form.Label>
              <Form.Control 
                  type="text"  
                  id="host_script_location_id"
                  name="host_script_location"
                  placeholder="Enter host script location" 
                  value={this.state.activeItem.host_script_location}
                  onChange={this.onChange}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        
        <Modal.Footer className="center">
        <div className="center">
          <Button variant="success" onClick={() => onSave(this.state.activeItem)} href="#/">EDIT</Button>{' '} 
        
          <Button variant="secondary" onClick={() => setShow(false)}>CANCEL</Button>
        </div>

        </Modal.Footer>
        
      </Modal>
       
    );
  }
}