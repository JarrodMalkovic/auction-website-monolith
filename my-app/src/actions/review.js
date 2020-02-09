import axios from 'axios';
import {
  GET_REVIEW,
  CLEAR_REVIEWS,
  GET_REVIEWS,
  DELETE_REVIEW,
  CLEAR_REVIEW,
  MARK_REVIEW_HELPFUL
} from './types';
import { addNotification } from './notification';

export const createReview = (
  id,
  title,
  text,
  rating,
  history
) => async dispatch => {
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

    await axios.post(`/api/review/${id}`, body, config);
    dispatch(addNotification('Review Created Successfully!', 'success'));
    history.push(`/profile/${id}`);
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
    dispatch(addNotification(err.response.data.msg, 'error'));
  }
};

export const deleteReview = id => async dispatch => {
  try {
    console.log(id);
    const res = await axios.delete(`/api/review/${id}`);
    dispatch({ type: DELETE_REVIEW, payload: res.data });
    dispatch(addNotification('Review Deleted Successfully!', 'success'));
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
    dispatch(addNotification(err.response.data.msg, 'error'));
  }
};

export const getReview = id => async dispatch => {
  try {
    dispatch({ type: CLEAR_REVIEWS });
    const res = await axios.get(`/api/review/${id}/one`);
    dispatch({ type: GET_REVIEW, payload: res.data.review });
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
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
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
  }
};

export const getReviewsWrittenByUser = () => async dispatch => {
  try {
    dispatch({ type: CLEAR_REVIEWS });
    const res = await axios.get(`/api/review`);
    dispatch({ type: GET_REVIEWS, payload: res.data });
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
  }
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

  const body = {
    title,
    text,
    rating
  };

  try {
    const res = await axios.patch(`/api/review/${id}`, body, config);
    history.push(`/profile/${res.data.review.writtenFor}`);
    dispatch(addNotification('Review Edited Successfully!', 'success'));
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
    dispatch(addNotification(err.response.data.msg, 'error'));
  }
};

export const markReviewAsHelpful = id => async dispatch => {
  try {
    const res = await axios.post(`/api/review/${id}/mark-helpful`);
    dispatch({ type: MARK_REVIEW_HELPFUL, payload: res.data.review });
    dispatch(
      addNotification('Review Marked as Helpful Successfully', 'success')
    );
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
    dispatch(addNotification(err.response.data.msg, 'error'));
  }
};
