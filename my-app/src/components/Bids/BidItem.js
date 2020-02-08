import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { deleteBid } from '../../actions/listing';

const BidItem = ({ bid, auth, deleteBid, listingId }) => {
  const onClick = () => {
    deleteBid(listingId, bid._id);
  };

  return (
    <div>
      <p>Amount: {bid.bid}</p>
      <p>Time: {bid.createdAt}</p>
      <p>Who: {bid.user}</p>
      {!auth.loading && auth.user._id == bid.user && (
        <button onClick={onClick}>DELETE</button>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deleteBid })(BidItem);
