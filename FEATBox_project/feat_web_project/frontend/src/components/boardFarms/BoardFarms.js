import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getBoardFarms, addBoardFarm, clickBoardFarm } from '../../actions/boardFarms';
import { Button, Col, Row, ListGroup, Card, Container, Spinner} from 'react-bootstrap';
// import boardFarms from '../../reducers/boardFarms';
import { MDBContainer } from "mdbreact";
import "../../../static/css/scrollbar.css";
import Modal from "../modal/ModalAdd";
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import Boards from '../boards/Boards';
// import Register from '../accounts/Register'

export class BoardFarms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      activeItem: {
        host_user: "",
        host_ip_address: "",
        host_password: "",
        user_id: "",
        host_script_location: ""
      },
    };
  }
  

  static propTypes = {
    boardFarms: PropTypes.array.isRequired,
    getBoardFarms: PropTypes.func.isRequired,
    addBoardFarm: PropTypes.func.isRequired,
    clickBoardFarm: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
  };

  // handleSubmit = (item) => {
  //   // this.toggle();

  //   if (item.id) {
  //     axios
  //       .put(`/api/todos/${item.id}/`, item)
  //       .then((res) => this.refreshList());
  //     return;
  //   }
  //   axios
  //     .post("/api/todos/", item)
  //     .then((res) => this.refreshList());
  // };

  onSubmit = (item) => {
    // e.preventDefault();
    // const { host_user, host_ip_address, host_ssh_key } = this.state;
    // const boardFarm = { host_user, host_ip_address, host_ssh_key };
    const boardFarm = item
    // console.log(boardFarm)
    this.props.addBoardFarm(boardFarm)
    this.setState({
      host_user: "",
      host_ip_address: "",
      host_password: "",
      user_id:"",
      host_script_location: ""
    });

    this.setShow();
  };


  setShow = () => {
    this.setState({ modal: !this.state.modal });
  };

  loadNewData = () => {
    this.props.getBoardFarms()
  }

  componentDidMount() {
    this.updateTimer = setInterval(() => this.loadNewData(),4000)

    this.props.getBoardFarms()
  }

  componentWillUnmount() {
    clearInterval(this.updateTimer);
  }

  createItem = () => {
    const { user } = this.props.auth;
    const item = { host_user: "", host_ip_address: "", host_password: "", user_id: user.id, host_script_location: "" }
    this.setState({ activeItem: item, modal: !this.state.modal })
  };


  clicked(boardFarm) {
    this.props.clickBoardFarm(boardFarm)
  }


  renderItems = () => {
    return (
    
      this.props.boardFarms.map((boardFarm) => (
      <ListGroup 
        key={boardFarm.farm_id}
        onClick={(id) => this.clicked(boardFarm)}
      >
        {boardFarm.status === "Available" ? (       
            <ListGroup.Item className="mt-2" action variant="success" href={'#boardfarms'}>        
              <Col>
              {"BoaboardFarm ID: " + boardFarm.farm_id}
              </Col>

              <Col>
              {"Status: " + boardFarm.status}
              </Col>
            </ListGroup.Item> 
        ) : (       
          <ListGroup.Item className="mt-2 box2" action variant="dark" href={'#boardfarms'}>        
            <Col>
            {"BoaboardFarm ID: " + boardFarm.farm_id}
            </Col>

            <Col>
            {"Status: " + boardFarm.status}
            </Col>
          </ListGroup.Item>     
        )}   
      </ListGroup>
      ))
    );
  }
        


  render() {
    const { user } = this.props.auth;
    const scrollContainerStyle = { width: "auto", height: "400px" };
    return (
      <Container className="mt-1" fluid >
        <MDBContainer>
          <div className="scrollbar mx-auto" style={scrollContainerStyle}>        
              {this.renderItems()}    
          </div>
        </MDBContainer>          

        {user.is_superuser ? (
          <Col lg={{ span: 6, offset: 7 }}>
            <Card style={{ width: '29rem' }} className="mt-2">
              <Card.Body>
                
                <Row className="d-flex justify-content-center">
                  <div>Don't have your own? Add new BoardFarm.</div>
                  <Button className="ml-3" variant="primary" onClick={this.createItem}>Add new</Button>{' '}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ):null}

        {this.state.modal ? (
        <Modal
          activeItem={this.state.activeItem}
          show = {true}
          setShow={this.setShow}
          onSave={this.onSubmit}
        />
        ) : null}
        
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  boardFarms: state.boardFarms.boardFarms,
  auth: state.auth,
});

export default connect(mapStateToProps, { getBoardFarms, addBoardFarm, clickBoardFarm })(BoardFarms)