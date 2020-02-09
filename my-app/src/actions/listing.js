import axios from 'axios';
import {
  GET_LISTINGS,
  GET_LISTING,
  CLEAR_LISTINGS,
  CLEAR_LISTING,
  GET_USERS_ACTIVE_LISTINGS,
  GET_USERS_INACTIVE_LISTINGS,
  DELETE_LISTING,
  DELETE_BID
} from './types';
import { addNotification } from './notification';

export const getListings = query => async dispatch => {
  try {
    const res = await axios.get(`/api/listings/${query}`);

    dispatch({ type: GET_LISTINGS, payload: res.data });
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
  }
};

export const getListing = slug => async dispatch => {
  try {
    const res = await axios.get(`/api/listings/slug/${slug}`);

    dispatch({ type: GET_LISTING, payload: res.data.listing });
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
  }
};

export const createListing = (
  title,
  description,
  minIncrement,
  category,
  endDate,
  condition,
  startPrice,
  image,
  history
) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = {
    title,
    description,
    minIncrement,
    category,
    endDate,
    condition,
    startPrice,
    image
  };

  try {
    const res = await axios.post('/api/listings', body, config);
    console.log(res);

    history.push(`/listings/${res.data.listing.slug}`);
    dispatch(addNotification('Listing Created Successfully', 'success'));
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
    dispatch(addNotification(err.response.data.msg, 'error'));
  }
};

export const deleteListing = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/listings/${id}`);
    dispatch({ type: DELETE_LISTING, payload: res.data });
    dispatch(addNotification('Listing Deleted Successfully', 'success'));
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
    dispatch(addNotification(err.response.data.msg, 'error'));
  }
};

export const editListing = (
  title,
  description,
  minIncrement,
  category,
  length,
  condition,
  startPrice,
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
    description,
    minIncrement,
    category,
    length,
    startPrice,
    condition
  };

  try {
    const res = await axios.patch(`/api/listings/${id}`, body, config);
    history.push(`/listings/${res.data.listing.slug}`);
    dispatch(addNotification('Listing Updated Successfully', 'success'));
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
    dispatch(addNotification(err.response.data.msg, 'error'));
  }
};

export const makeBid = (bid, listingId) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = {
      bid
    };

    const res = await axios.post(
      `/api/listings/${listingId}/bid`,
      body,
      config
    );

    dispatch({
      type: GET_LISTING,
      payload: res.data.listing
    });
    dispatch(
      addNotification(
        `Bid on item "${res.data.listing.title}" Placed Successfully`,
        'success'
      )
    );
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
    dispatch(addNotification(err.response.data.msg, 'error'));
  }
};

export const getActiveListingsByUserId = id => async dispatch => {
  try {
    const res = await axios.get(`/api/listings/${id}/active`);
    dispatch({
      type: GET_USERS_ACTIVE_LISTINGS,
      payload: res.data
    });
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
  }
};

export const getInactiveListingsByUserId = id => async dispatch => {
  try {
    const res = await axios.get(`/api/listings/${id}/inactive`);
    dispatch({
      type: GET_USERS_INACTIVE_LISTINGS,
      payload: res.data
    });
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
  }
};

export const getActiveListingsByToken = id => async dispatch => {
  try {
    const res = await axios.get(`/api/listings/dashboard/active`);
    dispatch({
      type: GET_USERS_ACTIVE_LISTINGS,
      payload: res.data
    });
    console.log(res.data);
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
  }
};

export const getInactiveListingsByToken = id => async dispatch => {
  try {
    const res = await axios.get(`/api/listings/dashboard/inactive`);
    dispatch({
      type: GET_USERS_INACTIVE_LISTINGS,
      payload: res.data
    });
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
  }
};

export const getBiddingHistory = () => async dispatch => {
  try {
    const res = await axios.get(`/api/users/bids`);
    dispatch({
      type: GET_LISTINGS,
      payload: res.data
    });
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
  }
};

export const getWonListings = () => async dispatch => {
  try {
    const res = await axios.get(`/api/listings/dashboard/won`);
    dispatch({
      type: GET_USERS_INACTIVE_LISTINGS,
      payload: res.data
    });
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
  }
};

export const clearListings = () => async dispatch => {
  dispatch({ type: CLEAR_LISTINGS });
};

export const clearListing = () => async dispatch => {
  dispatch({ type: CLEAR_LISTING });
};

export const setListingShipped = id => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = {
    shipped: Date.now()
  };
  try {
    const res = await axios.patch(`/api/listings/${id}`, body, config);
    dispatch(
      addNotification(
        `Listing ${res.data.listing.title} has been marked as Shipped Successfully`,
        'success'
      )
    );
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
    dispatch(addNotification(err.response.data.msg, 'error'));
  }
};

export const deleteBid = (listingId, bidId) => async dispatch => {
  try {
    const res = await axios.delete(`/api/listings/${listingId}/bid/${bidId}`);
    dispatch({ type: DELETE_BID, payload: res.data });
    dispatch(
      addNotification(
        `Bid  on item "${res.data.title}" Deleted Successfully`,
        'success'
      )
    );
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
    dispatch(addNotification(err.response.data.msg, 'error'));
  }
};