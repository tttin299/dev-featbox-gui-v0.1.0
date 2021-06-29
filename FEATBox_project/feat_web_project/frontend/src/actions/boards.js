import axios from 'axios';
import { createMessage, returnErrors } from './messages';
import { tokenConfig } from './auth';

import { GET_BOARDS, CONTROL_BOARD } from './types';



// GET BOARDS
export const getBoards = (farm_id) => (dispatch, getState) => {
  axios
    .get(`/feat/api/board/?farm_id=${farm_id}`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_BOARDS,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

// CONTROL BOARD
export const controlBoard = (boardFarm_id, board_id, board) => (dispatch, getState) => {
  axios
    .put(`/feat/api/board/${board_id}/`, board, tokenConfig(getState))
    .then((res) => 
      axios
      .get(`/feat/api/board/?farm_id=${boardFarm_id}`, tokenConfig(getState))
      .then((res) => {
        dispatch(createMessage({ controlBoard: 'BoardFarm Controlled' }));
        dispatch({
          type: GET_BOARDS,
          payload: res.data,
        });
      })
      .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)))   
    );
    // {
      
    //   dispatch(createMessage({ controlBoard: 'BoardFarm Controlled' }));
    //   dispatch({

    //     type: CONTROL_BOARD,
    //     payload: res.data,
    //   });

    //   getBoards(boardFarm_id);
    // })
    // .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
  // return;
};

// // EDIT BOARDFARM
// export const editBoardFarm = (id, boardFarm) => (dispatch, getState) => {
//   axios
//     .put(`/feat/api/boardfarm/${id}/`, boardFarm, tokenConfig(getState))
//     .then((res) => {
//       dispatch(createMessage({ editBoardFarm: 'BoardFarm Edited' }));
//       dispatch({
//         type: EDIT_BOARDFARM,
//         payload: res.data,
//       });
//     })
//     .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
// };