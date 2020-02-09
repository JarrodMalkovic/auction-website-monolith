import axios from 'axios';
import {
  LOGIN_SUCCESS,
  USER_LOADED,
  REGISTER_SUCCESS,
  USER_LOADING_ERROR,
  CLEAR_USER,
  LOGOUT
} from './types';
import { setAuthToken } from '../utils/setAuthToken';
import { addNotification } from './notification';

export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/auth', { email, password }, config);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    console.log('success');
    dispatch(loadUser());
    dispatch(addNotification('Logged in Successfully', 'success'));
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
    dispatch(addNotification(err.response.data.msg, 'error'));
  }
};

export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: USER_LOADING_ERROR });
    console.log(`Error: ${err.response.data.msg}`);
  }
};

export const register = (name, email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post(
      '/api/users',
      { name, email, password },
      config
    );

    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
    dispatch(loadUser());
  } catch (err) {
    console.log(`Error: ${err.response.data.msg}`);
    dispatch(addNotification(err.response.data.msg, 'error'));
  }
};

export const logout = () => dispatch => {
  dispatch({ type: CLEAR_USER });
  dispatch({ type: LOGOUT });
  dispatch(addNotification('Logged out Successfully', 'success'));
};
