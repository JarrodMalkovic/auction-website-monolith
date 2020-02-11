import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { deleteBid } from '../../actions/listing';
import io from 'socket.io-client';

const BidItem = ({ bid, auth, deleteBid, listingId, socket }) => {
  const onClick = async e => {
    await deleteBid(listingId, bid._id);
    socket.emit('deleted bid');
    console.log(socket);
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
