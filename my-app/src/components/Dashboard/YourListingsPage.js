import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getActiveListingsByToken,
  getInactiveListingsByToken,
  clearListings
} from '../../actions/listing';
import ListItem from '../Listings/ListItem';
import { Link } from 'react-router-dom';

const YourListingsPage = ({
  getActiveListingsByToken,
  getInactiveListingsByToken,
  clearListings,
  listings: { data, loading },
  auth
}) => {
  const [formData, setFormData] = useState({
    inactive: false
  });

  const { inactive } = formData;
  const onClick = () => {
    console.log(inactive);
    clearListings();
    !inactive === false
      ? getActiveListingsByToken()
      : getInactiveListingsByToken();
    setFormData({ inactive: !inactive });
    console.log(inactive);

    console.log(inactive);
  };

  useEffect(() => {
    console.log(auth.user);
    getActiveListingsByToken();
    return () => {
      clearListings();
    };
  }, [auth.loading, auth.isAuthenticated, auth.user]);

  return loading || data === null || auth.loading || auth.user === null ? (
    <div>Loading..</div>
  ) : (
    <div>
      <Link to={`/dashboard`}>
        <h4>Back to Dashboard</h4>
      </Link>{' '}
      <button onClick={onClick}>
        Show {inactive === false ? 'Inactive' : 'Active'} Listings
      </button>
      <h1>Your {inactive === false ? 'Active' : 'Inactive'} Listings</h1>
      <h3>Found {data.length} results</h3>
      {data.map(listing => (
        <ListItem key={listing._id} listing={listing} />
      ))}
    </div>
  );
};

YourListingsPage.propTypes = {};

const mapStateToProps = state => ({
  auth: state.auth,
  listings: state.listings
});
export default connect(mapStateToProps, {
  getActiveListingsByToken,
  getInactiveListingsByToken,
  clearListings
})(YourListingsPage);
