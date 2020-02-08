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

export const login = (email, password) => async dispatch => {
  console.log('g322et here');
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    console.log('get here');
    const res = await axios.post('/api/auth', { email, password }, config);
    console.log(res);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    console.log('success');
    dispatch(loadUser());
  } catch (err) {
    console.log('fail');
  }
};

export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    console.log('local:', localStorage.token);
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({ type: USER_LOADED, payload: res.data });
    // dispatch({
    //   type: USER_LOADED,
    //   payload: res
    // });
  } catch (err) {
    console.log('Couldnt load user..');
    dispatch({ type: USER_LOADING_ERROR });
  }
};

export const register = (name, email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    console.log('get here');
    const res = await axios.post(
      '/api/users',
      { name, email, password },
      config
    );

    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
    console.log(res);
    dispatch(loadUser());
  } catch (err) {
    console.log(err.message);
  }
};
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_USER });
  dispatch({ type: LOGOUT });
};
