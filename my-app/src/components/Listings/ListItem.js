import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { deleteListing, setListingShipped } from '../../actions/listing';
import ReportForm from '../Forms/ReportForm';
import Countdown from '../Layout/Countdown';

const ListItem = ({ listing, auth, deleteListing, setListingShipped }) => {
  const onClick = () => {
    let res = window.confirm('Are you sure you want to delete this listing?');
    if (res) {
      deleteListing(listing._id);
    }
  };

  const handleMarkShipped = () => {
    setListingShipped(listing._id);
    listing.shipped = Date.now();
  };

  return (
    <div>
      <Link to={`/listings/${listing.slug}`}>
        <h2>{listing.title}</h2>
      </Link>
      <p>Price : ${listing.currentPrice}</p>
      <p>
        Time Left: <Countdown endDate={listing.endDate} />
      </p>
      {listing.winner && <h4>winner: {listing.winner}</h4>}
      {!auth.loading && auth.user._id === listing.createdBy._id.toString() && (
        <Fragment>
          <Link to={`/listings/${listing.slug}/edit`}>
            <h4>Edit</h4>
          </Link>
          <button onClick={onClick}>Delete</button>
        </Fragment>
      )}
      <ReportForm type={'Listing'} id={listing._id} />
      {!auth.loading &&
        !listing.active &&
        auth.user._id === listing.createdBy._id.toString() && (
          <button onClick={handleMarkShipped}>Mark as shipped</button>
        )}
      {!auth.loading && !listing.active && (
        <h4>
          {listing.shipped
            ? `Item was shipped from ____ at ${listing.shipped}`
            : 'Item has not yet been shipped'}
        </h4>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deleteListing, setListingShipped })(
  ListItem
);
