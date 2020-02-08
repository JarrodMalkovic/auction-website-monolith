import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getUserById } from '../../actions/user';
import { getReviewsWrittenForUser } from '../../actions/review';
import { connect } from 'react-redux';
import { getActiveListingsByUserId } from '../../actions/listing';
import ListItem from '../Listings/ListItem';
import ReactModal from 'react-modal';
import ReviewItem from '../Reviews/ReviewItem';
import { Link } from 'react-router-dom';
import ReportForm from '../Forms/ReportForm';

const ProfilePage = ({
  match,
  getUserById,
  getActiveListingsByUserId,
  getReviewsWrittenForUser,
  user,
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
  }, [getActiveListingsByUserId, getUserById]);

  return user.loading ||
    user.data === null ||
    listings.loading ||
    listings.data === null ||
    reviews.data === null ||
    reviews.loading ? (
    <div>Loading..</div>
  ) : (
    <div>
      <img src={user.data.avatar} alt='' />
      <h2>{user.data.name}</h2>
      <ReportForm type={'user'} id={user.data._id} />
      <button onClick={handleOpenModal}>
        View Reviews ({reviews.data.length})
      </button>
      <Link to={`/profile/${user.data._id}/review`}>Write a Review</Link>
      <ReactModal
        isOpen={showModal}
        closeTimeoutMS={0}
        onRequestClose={handleCloseModal}
        onAfterClose={handleCloseModal}
        onAfterOpen={handleOpenModal}
      >
        <h1>Reviews</h1>
        {reviews.data.map(review => (
          <ReviewItem key={review._id} review={review} />
        ))}
      </ReactModal>
      <div>
        <h3>Browse {user.data.name.split(' ')[0]}'s listings</h3>
        {listings.data.map(listing => (
          <ListItem key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
};

ProfilePage.propTypes = {};

const mapStateToProps = state => ({
  user: state.user,
  listings: state.listings,
  reviews: state.reviews
});

export default connect(mapStateToProps, {
  getUserById,
  getReviewsWrittenForUser,
  getActiveListingsByUserId
})(ProfilePage);
