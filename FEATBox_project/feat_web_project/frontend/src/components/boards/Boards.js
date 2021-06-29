import React, { Component, Fragment } from 'react'
import { Container, Button, Card, Row, Col, ListGroup, Form, Table} from 'react-bootstrap'
import { MDBContainer } from "mdbreact"
import "../../../static/css/scrollbar.css"
import * as Icon from 'react-bootstrap-icons'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { editBoardFarm, removeBoardFarm, clickBoardFarm} from '../../actions/boardFarms'
import { getBoards, controlBoard } from '../../actions/boards'
import { getBoard_Logs, addBoard_Log } from '../../actions/board_logs'
import Modal from "../modal/ModalEdit"
import Modal_1 from "../modal/ModalRemove";
import { Chart } from "react-google-charts"
import { Redirect } from 'react-router'
// import { useEffect } from 'react'

var rowArray = []
var selDate = "All"
var selBoard_Id = "All"
var selAction = "All"
var dateArray = []
var boardIdArray = []
var actionArray = []
var lastBoardFarmId = []
var i = 1
var data_1= []
var data_2= []
var boardIdArrayChart = []
// const MINUTE_MS = 5000;

// useEffect(() => {
//   const interval = setInterval(() => {
//     console.log('Logs every minute');
//   }, MINUTE_MS);

//   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
// }, [])

export class Boards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      activeItem: {
        host_user: "",
        host_ip_address: "",
        password: "",
        user_id: ""
      },
      modal_1: false,
    }
  }

  static propTypes = {
    board_logs: PropTypes.array.isRequired,
    boards: PropTypes.array.isRequired,
    boardFarms: PropTypes.object.isRequired,
    getBoards: PropTypes.func.isRequired,
    editBoardFarm: PropTypes.func.isRequired,
    removeBoardFarm: PropTypes.func.isRequired,
    controlBoard: PropTypes.func.isRequired,
    getBoard_Logs: PropTypes.func.isRequired,
    addBoard_Log: PropTypes.func.isRequired,
    clickBoardFarm: PropTypes.func.isRequired,
    // addBoardFarm: PropTypes.func.isRequired,
    // auth: PropTypes.object.isRequired,
  };
  
  loadNewData = () => {
    const { current_boardFarm } = this.props.boardFarms
    this.props.getBoards(current_boardFarm.farm_id)
    this.getLogs()
  }

  componentDidMount = () => {
    this.updateTimer = setInterval(() => this.loadNewData(), 2000);
    const { current_boardFarm } = this.props.boardFarms;
    this.props.getBoards(current_boardFarm.farm_id);
    this.getAllLogs()
  }

  componentWillUnmount() {
    clearInterval(this.updateTimer);
  }

  controlBoard = (itemBoard, itemControl, status) => {  
    const { current_boardFarm } = this.props.boardFarms; 
    // var item_1 = {}
    var item_2 = {}
    var action = ""

    if(itemControl == "reset"){
      action = "reset"
    }
    
    else if(itemControl == "mode"){
      if(status == true){
        action = "monitor"
      }else{
        action = "uboot"
      }
    }else if(itemControl == "switch"){
      if(status == true){
        action = "boot"
      }else{
        action = "unboot"
      }
    }else{
      if(status == true){
        action = "on"
      }else{
        action = "off"
      }
    }

    item_2 = { host_user: current_boardFarm.host_user, host_ip_address: current_boardFarm.host_ip_address, host_password: current_boardFarm.host_password, board_id: itemBoard.board_id, board_i2c_address: itemBoard.board_i2c_address , action: action }
    this.props.addBoard_Log(item_2);
  };

  
  removeBoardFarm = () => {
    const { current_boardFarm } = this.props.boardFarms;
    const { user } = this.props.auth;
    const item = { host_user: current_boardFarm.host_user, host_ip_address: current_boardFarm.host_ip_address, host_password: current_boardFarm.host_password, user_id: user.id }

    this.setState({ activeItem: item, modal_1: !this.state.modal_1 })
  };


  editBoardFarm = () => {   
    const { user } = this.props.auth;
    const { current_boardFarm } = this.props.boardFarms;
    const item = { host_user: current_boardFarm.host_user, host_ip_address: current_boardFarm.host_ip_address, host_password: current_boardFarm.host_password, user_id: user.id, status: "Unavailable" }
    this.setState({ activeItem: item, modal: !this.state.modal });
  };


  setShow = () => {
    this.setState({ modal: !this.state.modal });
  };

  setShow_1 = () => {
    this.setState({ modal_1: !this.state.modal_1 });
  };


  onSubmit = (item) => {
    const { current_boardFarm } = this.props.boardFarms;
    const boardFarm = item
    this.props.editBoardFarm(current_boardFarm.farm_id, boardFarm);
    this.setState({
      host_user: "",
      host_ip_address: "",
      password: "",
      user_id:""
    });

    this.setShow();
  };


  onSubmit_1 = (item) => {
    const { current_boardFarm } = this.props.boardFarms
    const boardFarm = item
    this.props.removeBoardFarm(current_boardFarm.farm_id)
    this.setState({
      host_user: "",
      host_ip_address: "",
      password: "",
      user_id:""
    });

    this.setShow_1();
  };


  renderItems = () => {
    const { user } = this.props.auth
    const { current_boardFarm } = this.props.boardFarms;
    return (
      
      this.props.boards.map((board) => (
      <ListGroup 
        variant="flush"
        key={board.board_id}
    
      > 
         <ListGroup.Item >        
            <Row >
              <Col lg={7}>
                <Row>
                  <Col >
                    <strong>BOARD: {board.board_name}</strong>
                  </Col> 
                </Row>

                <Row className="mt-3">
                  <Col lg={4}>
                    <div>Power</div>
                  </Col>
                  <Col lg={8}>
                      <Button disabled={user.is_superuser && current_boardFarm.status == "Available" ? (false):(true)} variant={current_boardFarm.status == "Available" ? (board.power_status === true ? ("success"):("danger")):("secondary")} onClick={() => this.controlBoard(board, "power", !board.power_status)} >{board.power_status === true ? ("ON"):("OFF")}</Button >
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={4}>
                    <div>Boot</div>
                  </Col>
                  <Col lg={8}>
                    <Button disabled={user.is_superuser && current_boardFarm.status == "Available" ? (false):(true)} variant={current_boardFarm.status == "Available" ? (board.switch_status === true ? ("success"):("danger")):("secondary")} onClick={() => this.controlBoard(board, "switch", !board.switch_status)} >{board.switch_status === true ? ("ON"):("OFF")}</Button >
                  </Col>
                </Row>
              </Col>

              <Col lg={5}>
                <Row >
                  <Col >
                    <strong>BOARD_ID: {board.board_id}</strong>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={4}>
                    <div>Mode</div>
                  </Col>
        
                  <Col lg={8}>
                    <Button disabled={user.is_superuser && current_boardFarm.status == "Available" ? (false):(true)} variant={current_boardFarm.status == "Available" ? ("success"):("secondary")} onClick={() => this.controlBoard(board, "mode", !board.mode_status)} >{board.mode_status === true ? ("UBOOT"):("MONITOR")}</Button >
                  </Col>
                </Row>      
                
                {board.power_status === true && board.switch_status === true? (
                  <Row className="mt-3">
                    <Col lg={{ span: 8, offset: 4 }}>
                      <Button disabled={user.is_superuser && current_boardFarm.status == "Available" ? (false):(true)} variant={current_boardFarm.status == "Available" ? ("success"):("secondary")} onClick={() => this.controlBoard(board, "reset", board.mode_status)} >RESET</Button >
                    </Col>
                  </Row>):(null)}
                
              </Col>
            </Row>
          </ListGroup.Item>  
      </ListGroup>
      ))
    );
  }
  

  renderLog = () =>{
    return (
      <Table striped bordered hover size="sm" >
        <thead>
          <tr>
            {/* <th>#</th> */}
            <th>TIMESTAMP</th>
            <th>BOARD_ID</th>
            <th>I2C_ADDRESS</th>
            <th>BOARD_NAME</th>
            <th>ACTION</th>
            {/* <th>TIME</th> */}
            <th>SUCCESS</th>
            <th>FAIL</th>
          </tr>
        </thead>
        
        <tbody>
          {rowArray.map((board_log) => (
            <tr>
              <td>{board_log.date}</td>
              <td>{board_log.board_id}</td>
              <td>{board_log.board_i2c_address}</td>
              <td>{board_log.board_name}</td>
              <td>{board_log.action}</td>
              {/* <td>...</td> */}
              <td>{board_log.success}</td>
              <td>{board_log.fail}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }


  onIdChange = (e) => {
    let { name, value } = e.target;
    const { boardFarms } = this.props.boardFarms;
    
    for (let obj of boardFarms)
    { 
      if(obj.farm_id == value){
        this.props.clickBoardFarm(obj)
      }
    }
    
    this.props.getBoards(value);   
  };


  onDateChange = (e) => {
    let { name, value } = e.target
    if (value == "All Date"){
      selDate = "All"
    }else{
      selDate = value
    } 
    this.getLogs()
  };


  onBoardIdChange = (e) => {
    let { name, value } = e.target
    if (value == "All Board ID"){
      selBoard_Id = "All"
    }else{
      selBoard_Id = value
    }
    this.getLogs()
  };

  onActionChange = (e) => {
    let { name, value } = e.target;
    if (value == "All Action"){
      selAction = "All"
    }else{
      selAction = value
    }
    this.getLogs()
  };


  getLogs = () =>{
    i = 2
    const { current_boardFarm } = this.props.boardFarms;
    this.props.getBoard_Logs(current_boardFarm.farm_id, selDate, selBoard_Id, selAction)
  }


  getAllLogs = () =>{
    selDate = "All"
    selBoard_Id = "All"
    selAction = "All"
    i = 1
    const { current_boardFarm } = this.props.boardFarms;
    this.props.getBoard_Logs(current_boardFarm.farm_id, selDate, selBoard_Id, selAction)
  }


  showTable = () =>{
    var board_logs_tmp = []
    var rowArray_tmp = []
    var rowArray_1 = []
    var rowArray_2 = []
    var rowArray_3 = []
    boardIdArrayChart = []

    data_2 = []
    data_2 = [
      ['Board_ID', 'Success', 'Fail'],
    ]

    for (let obj of this.props.board_logs)
    {
      var item = {board_id:obj.board_id,date:obj.date,action:obj.action}
      item = JSON.stringify(item);
      board_logs_tmp.push(item); 
    }

    for (let obj of board_logs_tmp)
    { 
      if(rowArray_tmp.includes(obj)){
 
      }else{
        rowArray_tmp.push(obj);
      }
    }

    for (let obj of rowArray_tmp)
    { 
      var item = JSON.parse(obj)
      rowArray_1.push(item)
    }

    for (let obj of rowArray_1)
    { 
      var success = 0
      var fail = 0
      for(let obj1 of this.props.board_logs){
        if(obj.board_id == obj1.board_id & obj.date == obj1.date & obj.action == obj1.action){
          if(obj1.status == true)
            success+=1
          else
            fail+=1
        }
      }
      var item = {board_id:obj.board_id,date:obj.date,action:obj.action,success:success,fail:fail}
      rowArray_2.push(item)

      var successChart = 0
      var failChart = 0
      
      if(!boardIdArrayChart.includes(obj.board_id)){
        boardIdArrayChart.push(obj.board_id)
        for(let obj1 of this.props.board_logs){
          if(obj.board_id == obj1.board_id){
              if(obj1.status == true)
                successChart+=1
              else
                failChart+=1
            }   
        }   
        var itemChart = [String(obj.board_id), successChart, failChart]
        data_2.push(itemChart) 
      }
    }
    
    for (let obj of rowArray_2)
    {
      var board_i2c_address = ""
      var board_name = ""

      for(let obj1 of this.props.boards){
        if(obj.board_id == obj1.board_id){
          board_i2c_address = obj1.board_i2c_address
          board_name = obj1.board_name
        }
      }
      var item = {board_id:obj.board_id,board_i2c_address:board_i2c_address,board_name:board_name,date:obj.date,action:obj.action,success:obj.success,fail:obj.fail}
      rowArray_3.push(item)
    }
    rowArray = rowArray_3

    if(i == 1){
      dateArray = []
      boardIdArray = []
      actionArray = []
      if(rowArray_2){
        for (let obj of rowArray_2)
        { 
          if(dateArray.includes(obj.date)){
    
          }else{
            dateArray.push(obj.date);
          }

          if(boardIdArray.includes(obj.board_id)){
    
          }else{
            boardIdArray.push(obj.board_id);
          }

          if(actionArray.includes(obj.action)){
    
          }else{
            actionArray.push(obj.action);
          }
        }
      }
    }
  }


  render() {
    const { current_boardFarm } = this.props.boardFarms;
    const { boardFarms } = this.props.boardFarms;
    const { user } = this.props.auth;
    const scrollContainerStyle1 = { width: 'auto', height: "700px" }; 
    const scrollContainerStyle = { width: 'auto', height: "700px" };
    

    if (boardFarms.length == 0){
      this.setState({redirect: true})
    }


    if (this.state.redirect) {
      return <Redirect push to="/" />;
    }


    if (lastBoardFarmId != current_boardFarm.farm_id){
      this.getAllLogs()
      lastBoardFarmId =  current_boardFarm.farm_id
    }
      
    this.showTable()
    
    return (
      <Container className="mt-5" fluid>
        <Col lg={{ span: 12, offset:  0}}>
          <Row>
            <Col lg={4}>
              <Row>
                <Button variant="outline-primary" className="ml-5" href="#/">
                    <Icon.ChevronLeft />
                </Button>

                <strong className="ml-4">ID</strong>

                <Form className="ml-2">
                  <Form.Group controlId="exampleForm.SelectCustomSizeSm">      
                    <Form.Control 
                      as="select" 
                      onChange={this.onIdChange}
                      >
                    `<option>{current_boardFarm.farm_id}</option>
                      {boardFarms.map((boardFarm) =>(
                        boardFarm.status === "Available" ? (   
                          boardFarm.farm_id !== current_boardFarm.farm_id ?(  
                            <option>{boardFarm.farm_id}</option>
                          ):null
                        ):null
                      ))}
                     
                    </Form.Control>
                  </Form.Group>
                </Form>
                
              </Row>
            </Col>

            <Col lg={8}>
              <Row className="ml-4">              
                <strong>IP ADDRESS</strong>
                <Form className="ml-2">
                  <Form.Control type="text" placeholder={current_boardFarm.host_ip_address} readOnly />
                </Form>
                {user.is_superuser ? (
                  <Button className="ml-2" variant="dark" onClick={this.editBoardFarm } size="sm">EDIT</Button>
                ):null}
              </Row>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col lg={8}>
              <MDBContainer>
                <div className="scrollbar mx-auto" style={scrollContainerStyle1}>   
                  <Row>
                    <Col>
                      <div>Date Selection</div>
                      <Form>
                        <Form.Group controlId="exampleForm.SelectCustomSizeSm">      
                          <Form.Control as="select" size="sm" onChange={this.onDateChange}>
                            <option>All Date</option>
                            
                            {dateArray.map((date) =>(                        
                              <option>{date}</option>
                            ))}
                          
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    </Col> 

                    <Col>
                      <div>Board_ID Selection</div>
                      <Form >
                        <Form.Group controlId="exampleForm.SelectCustomSizeSm">      
                          <Form.Control as="select" size="sm" onChange={this.onBoardIdChange}>

                          <option>All Board ID</option>
                            {boardIdArray.map((board_id) =>(                        
                              <option>{board_id}</option>         
                            ))}
                    
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    </Col>

                    <Col>
                      <div>Action Selection</div>
                      <Form>
                        <Form.Group controlId="exampleForm.SelectCustomSizeSm">      
                          <Form.Control as="select" size="sm" onChange={this.onActionChange}>
                            <option>All Action</option>
                            {actionArray.map((action) =>(                        
                              <option>{action}</option>         
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    </Col>
                  </Row>

                  <Row>  
                    <Chart
                      className="ml-5"
                      height="280px"
                      chartType="Bar"
                      data={data_2}
                      options={{
                        legend: { position: 'top' },

                        chart: {
                          
                          title: 'Actives History',
                        },
                      }}
                    
                      rootProps={{ 'data-testid': '2' }}
                    />
                  </Row>  

                  <Row>
                    <Col >
                      {this.renderLog()}
                    </Col>
                  </Row> 
                </div>
              </MDBContainer>
              
              {user.is_superuser ? (
                <Row className="justify-content-md-end">
                  <Button className="mt-1" variant="danger"
                    onClick={this.removeBoardFarm}
                    // href={'#boardfarms/' + current_boardFarm.farm_id}
                    >
                    REMOVE</Button>{' '}
                </Row>
              ):null}
            </Col>

            <Col lg={4}>
              <Row>
                <Col lg={{ span: 6, offset: 3 }}>
                  <strong className="ml-3">BOARD STATUS</strong>
                </Col>  
              </Row>
                
              <MDBContainer className="mt-3">
                <div className="scrollbar mx-auto" style={scrollContainerStyle}>        
                    {this.renderItems()}    
                </div>
              </MDBContainer> 

              {this.state.modal ? (
              <Modal
                activeItem={this.state.activeItem}
                show = {true}
                setShow={this.setShow}
                onSave={this.onSubmit}
              />
              ) : null}

              {this.state.modal_1 ? (
              <Modal_1
                activeItem={this.state.activeItem}
                show = {true}
                setShow={this.setShow_1}
                onSave={this.onSubmit_1}
              />
              ) : null}
            </Col>
          </Row>
        </Col>
      </Container>
    )
  }
}
  
const mapStateToProps = (state) => ({
  board_logs: state.board_logs.board_logs,
  boards: state.boards.boards,
  boardFarms: state.boardFarms,
  auth: state.auth,
});

export default connect(mapStateToProps, { getBoards, editBoardFarm, removeBoardFarm, clickBoardFarm, controlBoard, getBoard_Logs, addBoard_Log })(Boards);
