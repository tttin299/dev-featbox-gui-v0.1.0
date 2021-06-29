import axios from 'axios';
import { createMessage, returnErrors } from './messages';
import { tokenConfig } from './auth';

import { GET_BOARD_LOGS, ADD_BOARD_LOG } from './types';

// export const showBoard_Log = (arrayLog) => ({
//   type: SHOW_BOARD_LOG,
//   payload: arrayLog
// });

// GET BOARD_LOG
export const getBoard_Logs = (farm_id, date, board_id, action) => (dispatch, getState) => {
  axios
    .get(`/feat/api/board_log/?farm_id=${farm_id}&date=${date}&board_id=${board_id}&action=${action}`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_BOARD_LOGS,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};


// ADD BOARD_LOG
export const addBoard_Log = (Board_Log) => (dispatch, getState) => {
  axios
    .post('/feat/api/board_log/', Board_Log, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ addBoard_Log: 'Board_Log Added' }));
      console.log(res.data)
      if(res.data != ""){
        dispatch({
          type: ADD_BOARD_LOG,
          payload: res.data,
        })
      }
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};