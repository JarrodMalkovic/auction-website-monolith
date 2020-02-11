import React, { Fragment, useEffect, useState } from 'react';
import { getListing, makeBid } from '../../actions/listing';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactModal from 'react-modal';
import BidItem from '../Bids/BidItem';
import { clearListing } from '../../actions/listing';
import ReportForm from '../Forms/ReportForm';
import Countdown from '../Layout/Countdown';
import io from 'socket.io-client';

const Listing = ({
  getListing,
  makeBid,
  match,
  clearListing,
  listing: { data, loading, errors },
  auth
}) => {
  const [modalData, setModalData] = useState({
    showModal: false
  });

  const [uploading, setUploading] = useState(false);

  const { showModal } = modalData;

  const handleOpenModal = () => {
    setModalData({ showModal: true });
  };

  const handleCloseModal = () => {
    setModalData({ showModal: false });
  };

  useEffect(() => {
    getListing(match.params.slug);
    var socket_connect = function(room) {
      return io('http://127.0.0.1:5000/', {
        query: 'r_var=' + room
      });
    };
    var room = window.location.pathname;
    var socket = socket_connect(room);

    socket.emit('join');

    setSocketData({ socket });

    socket.on('bid', function() {
      getListing(match.params.slug);
    });
    return () => {
      clearListing();
      console.log('disconnecting..');
      socket.emit('unsubscribe', room);
    };
  }, [getListing]);

  const [socketData, setSocketData] = useState({
    socket: ''
  });

  let { socket } = socketData;

  const [formData, setFormData] = useState({
    bid: ''
  });

  const { bid } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setUploading(true);
    await makeBid(bid, data._id);
    setUploading(false);
    setFormData({ bid: '' });
    socket.emit('bid');
  };

  return (loading || data === null) && !errors ? (
    <div>Loading..</div>
  ) : errors ? (
    <div>No listing found</div>
  ) : (
    <div>
      <Helmet>
        <title>{data.title} | Auction</title>
      </Helmet>
      <h1>{data.title}</h1>
      {!data.active && <h3>Listing has ended</h3>}
      <Link to={`/profile/${data.createdBy._id}`}>
        Listing created by {data.createdBy.name}
      </Link>
      <img src={data.image}></img>
      {auth.isAuthenticated && auth.user._id != data.createdBy._id && (
        <ReportForm type={'Listing'} id={data._id} />
      )}
      {!auth.loading && auth.user._id == data.createdBy._id && (
        <Link to={`/listings/${data.slug}/edit`}>
          <h4>EDIT</h4>
        </Link>
      )}
      <p>
        Bids: <Link onClick={handleOpenModal}> {data.bids.length} </Link>{' '}
      </p>
      <p>
        Time Left: <Countdown endDate={data.endDate} />
      </p>
      <ReactModal
        isOpen={showModal}
        closeTimeoutMS={0}
        onRequestClose={handleCloseModal}
        onAfterClose={handleCloseModal}
        onAfterOpen={handleOpenModal}
      >
        <h1>Bids</h1>
        {data.bids.length === 0 ? (
          <p>There are no bids on this item yet</p>
        ) : (
          <div>
            {data.bids.map(bid => (
              <BidItem
                listingId={data._id}
                key={bid._id}
                bid={bid}
                socket={socket}
              />
            ))}
          </div>
        )}
      </ReactModal>
      <p>Current Price: ${data.currentPrice}</p>
      {!auth.loading && auth.isAuthenticated && (
        <form className='form' onSubmit={e => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='number'
              placeholder={`Enter bid higher than $${data.currentPrice +
                data.minIncrement}`}
              name='bid'
              value={bid}
              step='0.01'
              onChange={e => onChange(e)}
              disabled={data.active ? false : true}
              required
            />
          </div>
          <input
            type='submit'
            className='btn btn-primary'
            value={uploading ? 'Placing bet..' : 'Place bet'}
            disabled={data.active ? false : true}
          />
        </form>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  listing: state.listing,
  auth: state.auth
});

export default connect(mapStateToProps, { getListing, makeBid, clearListing })(
  Listing
);
