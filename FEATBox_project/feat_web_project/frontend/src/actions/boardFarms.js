import axios from 'axios';
import { createMessage, returnErrors } from './messages';
import { tokenConfig } from './auth';

import { GET_BOARDFARMS, REMOVE_BOARDFARM, ADD_BOARDFARM, EDIT_BOARDFARM, CLICK_BOARDFARM } from './types';

export const clickBoardFarm = (boardFarm) => ({
  type: CLICK_BOARDFARM,
  payload: boardFarm
});

// GET BOARDFARMS
export const getBoardFarms = () => (dispatch, getState) => {
  axios
    .get('/feat/api/boardfarm/', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_BOARDFARMS,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

// REMOVE BOARDFARM
export const removeBoardFarm = (id) => (dispatch, getState) => {
  axios
    .delete(`/feat/api/boardfarm/${id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ deleteBoardFarm: 'BoardFarm Deleted' }));
      dispatch({
        type: REMOVE_BOARDFARM,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD BOARDFARM
export const addBoardFarm = (boardFarm) => (dispatch, getState) => {
  axios
    .post('/feat/api/boardfarm/', boardFarm, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ addBoardFarm: 'BoardFarm Added' }));
      if(res.data != ""){
        dispatch({
          type: ADD_BOARDFARM,
          payload: res.data,
        });
      }
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

// EDIT BOARDFARM
export const editBoardFarm = (id, boardFarm) => (dispatch, getState) => {
  axios
    .put(`/feat/api/boardfarm/${id}/`, boardFarm, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ editBoardFarm: 'BoardFarm Edited' }));
      dispatch({
        type: EDIT_BOARDFARM,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};