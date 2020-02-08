import axios from 'axios';
import { GET_USER } from './types';

export const getUserById = id => async dispatch => {
  const res = await axios.get(`/api/users/${id}`);
  console.log(res);
  dispatch({ type: GET_USER, payload: res.data });
};

export const getUserByToken = () => async dispatch => {
  const res = await axios.get(`/api/users/me`);
  dispatch({ type: GET_USER, payload: res.data });
};

export const updateUserProfile = (
  name,
  email,
  password,
  location,
  bio
) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = {
    name,
    email,
    password,
    location,
    bio
  };

  try {
    const res = await axios.patch('/api/users/me', body, config);
  } catch (err) {
    console.log('err');
    console.log(err.message);
  }
};
