import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getUserById, clearUser } from '../../actions/user';
import { getReviewsWrittenForUser, clearReviews } from '../../actions/review';
import { connect } from 'react-redux';
import {
  getActiveListingsByUserId,
  clearListings
} from '../../actions/listing';
import ListItem from '../Listings/ListItem';
import ReactModal from 'react-modal';
import ReviewItem from '../Reviews/ReviewItem';
import { Link } from 'react-router-dom';
import ReportForm from '../Forms/ReportForm';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

const ProfilePage = ({
  match,
  getUserById,
  getActiveListingsByUserId,
  getReviewsWrittenForUser,
  user,
  clearUser,
  clearReviews,
  clearListings,
  auth,
  listings,
  reviews
}) => {
  const [formData, setFormData] = useState({
    showModal: false
  });

  const { showModal } = formData;

  const handleOpenModal = () => {
    setFormData({ showModal: true });
  };

  const handleCloseModal = () => {
    setFormData({ showModal: false });
  };

  useEffect(() => {
    getActiveListingsByUserId(match.params.id);
    getUserById(match.params.id);
    getReviewsWrittenForUser(match.params.id);
    return () => {
      clearUser();
      clearListings();
      clearReviews();
    };
  }, [
    getActiveListingsByUserId,
    getUserById,
    clearUser,
    clearListings,
    clearReviews
  ]);

  return (user.loading ||
    user.data === null ||
    auth.loading ||
    auth.user === null ||
    listings.loading ||
    listings.data === null ||
    reviews.data === null ||
    reviews.loading) &&
    !user.errors ? (
    <div>Loading..</div>
  ) : user.errors ? (
    <div>No user found</div>
  ) : (
    <Fragment>
      <Helmet>
        <title>{user.data.name} | Auction</title>
      </Helmet>
      <img src={user.data.avatar} alt='User profile picture' />
      <h2>{user.data.name}</h2>
      <button onClick={handleOpenModal}>
        View Reviews ({reviews.data.length})
      </button>
      {auth.isAuthenticated && auth.user._id != user.data._id && (
        <ReportForm type={'user'} id={user.data._id} />
      )}
      {auth.isAuthenticated && auth.user._id != user.data._id && (
        <Link to={`/profile/${user.data._id}/review`}>Write a Review</Link>
      )}
      <ReactModal
        isOpen={showModal}
        closeTimeoutMS={0}
        onRequestClose={handleCloseModal}
        onAfterClose={handleCloseModal}
        onAfterOpen={handleOpenModal}
      >
        <h1>Reviews</h1>
        {reviews.data.length === 0
          ? 'This user has no reviews yet'
          : reviews.data.map(review => (
              <ReviewItem key={review._id} review={review} />
            ))}
      </ReactModal>
      <div>
        <h3>Browse {user.data.name.split(' ')[0]}'s recent listings</h3>
        {listings.data.length === 0
          ? 'This user has no active listenings at the moment'
          : listings.data.map(listing => (
              <ListItem key={listing._id} listing={listing} />
            ))}
      </div>
    </Fragment>
  );
};

ProfilePage.propTypes = {};

const mapStateToProps = state => ({
  user: state.user,
  listings: state.listings,
  reviews: state.reviews,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getUserById,
  getReviewsWrittenForUser,
  getActiveListingsByUserId,
  clearReviews,
  clearUser,
  clearListings
})(ProfilePage);
