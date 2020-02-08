import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBiddingHistory, getWonListings } from '../../actions/listing';
import ListItem from '../Listings/ListItem';
import { Link } from 'react-router-dom';
import { clearListings } from '../../actions/listing';

const BiddingHistoryPage = ({
  getBiddingHistory,
  clearListings,
  getWonListings,
  listings: { data, loading },
  auth
}) => {
  useEffect(() => {
    getBiddingHistory();
    return () => {
      clearListings();
    };
  }, [auth.loading, auth.isAuthenticated, auth.user, getBiddingHistory]);

  const showWonListings = () => {
    clearListings();
    getWonListings();
  };

  const showLostListings = () => {
    clearListings();
  };

  const showBidOnListings = () => {
    clearListings();
    getBiddingHistory();
  };

  return loading || data === null || auth.loading || auth.user === null ? (
    <div>Loading..</div>
  ) : (
    <div>
      <Link to={`/dashboard`}>
        <h4>Back to Dashboard</h4>
      </Link>{' '}
      <button onClick={showWonListings}>Show listings you've won</button>
      <button onClick={showLostListings}>Show listings you've lost</button>
      <button onClick={showBidOnListings}>
        Show active listings you've bid on
      </button>
      <h1>Active listings you've bid on</h1>
      <h3>Found {data.length} results</h3>
      {data.map(listing => (
        <ListItem key={listing._id} listing={listing} />
      ))}
    </div>
  );
};

BiddingHistoryPage.propTypes = {};

const mapStateToProps = state => ({
  auth: state.auth,
  listings: state.listings
});
export default connect(mapStateToProps, {
  getBiddingHistory,
  clearListings,
  getWonListings
})(BiddingHistoryPage);
