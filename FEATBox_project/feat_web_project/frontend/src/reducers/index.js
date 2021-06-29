import { combineReducers } from 'redux';
import boardFarms from './boardFarms';
import errors from './errors';
import messages from './messages';
import auth from './auth';
import boards from './boards';
import board_logs from './board_logs';

export default combineReducers({
  boardFarms,
  errors,
  messages,
  auth,
  boards,
  board_logs,
});