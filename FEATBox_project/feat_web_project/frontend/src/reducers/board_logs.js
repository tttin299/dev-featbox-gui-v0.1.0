import { GET_BOARD_LOGS, ADD_BOARD_LOG } from '../actions/types.js';

const initialState = {
  board_logs: [],
  // board_logs_show: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
      // case SHOW_BOARD_LOG:
      //   return {
      //     ...state,
      //     board_logs_show: action.payload,
      //   };

      case GET_BOARD_LOGS:
        return {
          ...state,
          board_logs: action.payload,
        };

      case ADD_BOARD_LOG:
        return {
          ...state,
          board_logs: [...state.board_logs, action.payload],
        };

      default:
        return state;
  }
}
