import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from '../auth/LoginPage';
import Register from '../auth/RegisterPage';
import Listings from '../Listings/Listings';
import Listing from '../Listing/Listing';
import ListingForm from '../Forms/ListingForm';
import EditListingPage from '../Listing/EditListingPage';
import CreateListingPage from '../Listing/CreateListingPage';
import { loadUser } from '../../actions/auth';
import { connect } from 'react-redux';
import PrivateRoute from '../routing/PrivateRoute';
import ProfilePage from '../Profile/ProfilePage';
import Dashboard from '../Dashboard/Dashboard';
import CreateReviewPage from '../Reviews/CreateReviewPage';
import EditProfilePage from '../Profile/EditProfilePage';
import YourListingsPage from '../Dashboard/YourListingsPage';
import BiddingHistoryPage from '../Dashboard/BiddingHistoryPage';
import YourReviewsPage from '../Dashboard/YourReviewsPage';
import EditReviewPage from '../Reviews/EditReviewPage';
import PageNotFound from '../Layout/PageNotFound';

const Routes = ({ loadUser, dispatch }) => {
  useEffect(() => {
    loadUser();
  }, []);
  return (
    <div>
      <Switch>
        <Route exact path='/login' component={Login} />\
        <Route exact path='/register' component={Register} />
        <Route exact path='/listings' component={Listings} />
        <Route exact path='/listings/:slug' component={Listing} />
        <PrivateRoute exact path='/create' component={CreateListingPage} />
        <PrivateRoute
          exact
          path='/listings/:slug/edit'
          component={EditListingPage}
        />
        <Route exact path='/profile/:id' component={ProfilePage} />
        <Route exact path='/profile/:id/review' component={CreateReviewPage} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <PrivateRoute
          exact
          path='/reviews/:id/edit'
          component={EditReviewPage}
        />
        <PrivateRoute
          exact
          path='/dashboard/edit'
          component={EditProfilePage}
        />
        <PrivateRoute
          exact
          path='/dashboard/listings'
          component={YourListingsPage}
        />
        <PrivateRoute
          exact
          path='/dashboard/reviews'
          component={YourReviewsPage}
        />
        <PrivateRoute
          exact
          path='/dashboard/bids'
          component={BiddingHistoryPage}
        />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  );
};

export default connect(null, { loadUser })(Routes);
