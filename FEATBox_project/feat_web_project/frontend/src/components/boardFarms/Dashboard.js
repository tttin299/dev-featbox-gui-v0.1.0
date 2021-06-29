import React, { Fragment } from 'react';
// import Form from './Form';
import BoardFarms from './BoardFarms';
import { Container } from 'react-bootstrap';
// import Jumbotron from "./logo.png"

export default function Dashboard() {
  return (
    <Container>
      <div className='mt-1'>Welcom to FEATBox Board Manager</div>
      <div>Description</div>
      <div className='mt-3'>Lists of Available BoardFarm</div>
      <BoardFarms />
    </Container>
  );
}