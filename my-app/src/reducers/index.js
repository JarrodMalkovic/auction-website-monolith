import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import user from './user';
import reviews from './reviews';
import review from './review';
import listings from './listings';
import listing from './listing';

export default combineReducers({
  auth,
  listings,
  listing,
  user,
  reviews,
  review
});
