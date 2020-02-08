import axios from 'axios';
import {
  CREATE_REVIEW,
  GET_REVIEW,
  CLEAR_REVIEWS,
  GET_REVIEWS,
  DELETE_REVIEW,
  CLEAR_REVIEW,
  MARK_REVIEW_HELPFUL
} from './types';

export const createReview = (id, title, text, rating) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = {
      title,
      text,
      rating
    };

    const res = await axios.post(`/api/review/${id}`, body, config);
  } catch (err) {
    console.log('err');
    console.log(err);
  }
};

export const deleteReview = id => async dispatch => {
  try {
    console.log(id);
    const res = await axios.delete(`/api/review/${id}`);
    dispatch({ type: DELETE_REVIEW, payload: res.data });
    console.log(res.data);
  } catch (err) {
    console.log('err');
    console.log(err);
  }
};

export const getReview = id => async dispatch => {
  try {
    dispatch({ type: CLEAR_REVIEWS });
    const res = await axios.get(`/api/review/${id}/one`);
    console.log(res.data.review);
    dispatch({ type: GET_REVIEW, payload: res.data.review });
  } catch (err) {
    console.log('err');
    console.log(err);
  }
};

export const clearReviews = () => async dispatch => {
  console.log('Clearing');
  dispatch({ type: CLEAR_REVIEWS });
};

export const clearReview = () => async dispatch => {
  console.log('Clearing');
  dispatch({ type: CLEAR_REVIEW });
};

export const getReviewsWrittenForUser = id => async dispatch => {
  try {
    dispatch({ type: CLEAR_REVIEWS });
    const res = await axios.get(`/api/review/${id}`);
    dispatch({ type: GET_REVIEWS, payload: res.data });
  } catch (err) {}
};

export const getReviewsWrittenByUser = () => async dispatch => {
  try {
    dispatch({ type: CLEAR_REVIEWS });
    const res = await axios.get(`/api/review`);
    dispatch({ type: GET_REVIEWS, payload: res.data });
  } catch (err) {}
};

export const editReview = (
  title,
  text,
  rating,
  id,
  history
) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  console.log(id);
  const body = {
    title,
    text,
    rating
  };

  try {
    const res = await axios.patch(`/api/review/${id}`, body, config);
    history.push(`/profile/${res.data.review.writtenFor}`);
  } catch (err) {
    console.log('err');
    console.log(err.message);
  }
};

export const markReviewAsHelpful = id => async dispatch => {
  try {
    const res = await axios.post(`/api/review/${id}/mark-helpful`);
    console.log(res.data.review);
    dispatch({ type: MARK_REVIEW_HELPFUL, payload: res.data.review });
  } catch (err) {
    console.log('err');
    console.log(err.message);
  }
};
