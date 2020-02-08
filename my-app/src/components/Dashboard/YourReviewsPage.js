import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getReviewsWrittenByUser,
  getReviewsWrittenForUser,
  clearReviews
} from '../../actions/review';
import { clearListings } from '../../actions/listing';
import { Link } from 'react-router-dom';
import ReviewItem from '../Reviews/ReviewItem';

const YourReviewsPage = ({
  clearListings,
  clearReviews,
  auth,
  reviews: { data, loading },
  getReviewsWrittenByUser,
  getReviewsWrittenForUser
}) => {
  const [formData, setFormData] = useState({
    writtenByYou: false
  });

  const { writtenByYou } = formData;

  const onClick = () => {
    !writtenByYou === false
      ? getReviewsWrittenByUser()
      : getReviewsWrittenForUser(auth.user._id);
    setFormData({ writtenByYou: !writtenByYou });
  };

  useEffect(() => {
    getReviewsWrittenByUser();
    return () => {
      clearReviews();
    };
  }, [auth.loading, auth.isAuthenticated, auth.user]);

  return auth.loading || auth.user === null || loading || data === null ? (
    <div>Loading..</div>
  ) : (
    <div>
      <Link to={`/dashboard`}>
        <h4>Back to Dashboard</h4>
      </Link>{' '}
      <button onClick={onClick}>Show reviews you've written</button>
      <h1>Reviews customers have written about you</h1>
      <h3>Found {data.length} results</h3>
      {data.map(review => (
        <ReviewItem key={review._id} review={review} />
      ))}
    </div>
  );
};

YourReviewsPage.propTypes = {};

const mapStateToProps = state => ({
  auth: state.auth,
  reviews: state.reviews
});

export default connect(mapStateToProps, {
  clearListings,
  getReviewsWrittenByUser,
  getReviewsWrittenForUser,
  clearReviews
})(YourReviewsPage);
