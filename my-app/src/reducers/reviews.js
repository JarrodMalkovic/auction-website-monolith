import {
  GET_REVIEWS,
  CLEAR_REVIEWS,
  DELETE_REVIEW,
  MARK_REVIEW_HELPFUL
} from '../actions/types';

const initialState = {
  data: null,
  loading: true
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case MARK_REVIEW_HELPFUL:
      return {
        ...state,
        data: state.data.map(review =>
          review._id == payload._id ? payload : review
        ),
        loading: false
      };
    case GET_REVIEWS:
      return {
        ...state,
        data: payload,
        loading: false
      };

    case CLEAR_REVIEWS:
      return {
        ...state,
        data: null,
        loading: true
      };
    case DELETE_REVIEW:
      return {
        ...state,
        data: state.data.filter(review => review._id !== payload._id)
      };
    default:
      return state;
  }
}
