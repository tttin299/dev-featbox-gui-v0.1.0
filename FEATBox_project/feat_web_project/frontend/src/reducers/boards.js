import { GET_BOARDS, CONTROL_BOARD } from '../actions/types.js';

const initialState = {
  boards: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_BOARDS:
      return {
        ...state,
        boards: action.payload,
      };
    
    case CONTROL_BOARD:
      return {
        ...state,
        boards: [...state.boards, action.payload],
      };
 
    default:
      return state;
  }
}

