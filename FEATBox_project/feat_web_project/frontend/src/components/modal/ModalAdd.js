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
    // const file = e.target.files[0];

    let { name, value } = e.target;
    const activeItem = { ...this.state.activeItem, [name]: value };
    // var activeItem = this.activeItem.append("ssh_key",file)

    this.setState({ activeItem });
  };

  // const handleFileInput = (e) => {
  //   // handle validations
  //   onFileSelect(e.target.files[0])
  // };


  // showFile = () => {
  //   // if (window.File && window.FileReader && window.FileList && window.Blob) {
  //     var preview = document.getElementById('show-text');
  //     var file = document.querySelector('input[type=file]').files[0];
  //     var reader = new FileReader()
  //     var textFile = /text.*/;

  //     if (file.type.match(textFile)) {
  //       reader.onload = function (event) {
  //         preview.innerHTML = event.target.result;
  //         const activeItem = { ...this.state.activeItem, pass: preview.innerHTML };
  //         this.setState({ activeItem })
  //       }.bind(this);
  //     } else {
  //       preview.innerHTML = "<span class='error'>It doesn't seem to be a text file!</span>";
  //     }
  //     reader.readAsText(file);

  // //  } else {
  // //     alert("Your browser is too old to support HTML5 File API");
  // //  }
  // }



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
              <Form.Label>PASSWORD</Form.Label>
              <Form.Control 
                  type="password" 
                  id="host_password_id"
                  name="host_password"
                  placeholder="Enter password" 
                  value={this.state.activeItem.host_password}
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