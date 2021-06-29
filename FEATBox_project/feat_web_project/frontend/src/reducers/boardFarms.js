import { GET_BOARDFARMS, REMOVE_BOARDFARM, ADD_BOARDFARM, EDIT_BOARDFARM, CLICK_BOARDFARM } from '../actions/types.js';

const initialState = {
  boardFarms: [],
  current_boardFarm: null,
};

export default function (state = initialState, action) {
  // console.log(action)
  switch (action.type) {
    case GET_BOARDFARMS:
      return {
        ...state,
        boardFarms: action.payload,
      };

    case REMOVE_BOARDFARM:
      return {
        ...state,
        boardFarms: state.boardFarms.filter((boardFarm) => boardFarm.farm_id !== action.payload),
      };

    case ADD_BOARDFARM:
      return {
        ...state,
        boardFarms: [...state.boardFarms, action.payload],
      };

    case EDIT_BOARDFARM:
      return {
        ...state,
        boardFarms: [...state.boardFarms, action.payload],
      };

    case CLICK_BOARDFARM:
      return {
        ...state,
        current_boardFarm: action.payload,
      };
   
    default:
      return state;
  }
}