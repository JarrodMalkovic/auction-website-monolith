import { GET_USER, CLEAR_USER } from '../actions/types';

const initialState = {
  data: null,
  loading: true
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_USER: {
      return { ...state, data: payload, loading: false };
    }
    case CLEAR_USER: {
      return {
        ...state,
        data: null,
        loading: false
      };
    }
    default:
      return state;
  }
}
