import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { deleteReview, markReviewAsHelpful } from '../../actions/review';
import ReportForm from '../Forms/ReportForm';

const ReviewItem = ({ review, auth, deleteReview, markReviewAsHelpful }) => {
  const [uploading, setUploading] = useState(false);

  const handleDeleteOption = () => {
    deleteReview(review._id);
  };

  const handleHelpfulOption = async e => {
    setUploading(true);
    await markReviewAsHelpful(review._id);
    setUploading(false);
  };
  return (
    <div>
      <h2>{review.title}</h2>
      <h2>
        Written by{' '}
        <Link to={`/profile/${review.writtenBy}`}>
          {review.writtenBy} on {review.writtenAt}
        </Link>
      </h2>
      <p>
        {review.helpfulCount} {review.helpfulCount === 1 ? 'person' : 'people'}{' '}
        found this review helpful
      </p>
      <p>{review.rating}/5</p>
      <p>{review.text}</p>

      {!auth.loading && auth.user._id === review.writtenBy && (
        <div>
          <Link to={`/reviews/${review._id}/edit`}>Edit</Link>
          <button onClick={handleDeleteOption}>Delete Review</button>
        </div>
      )}

      {!auth.loading &&
        auth.isAuthenticated &&
        auth.user._id != review.writtenBy &&
        (review.markedAsHelpful.some(el => el.user == auth.user._id) ? (
          'Thanks for your feedback!'
        ) : (
          <button onClick={handleHelpfulOption}>
            {uploading ? 'Sending feedback...' : 'Mark review as helpful'}
          </button>
        ))}

      {!auth.loading &&
        auth.isAuthenticated &&
        auth.user._id != review.writtenBy && (
          <ReportForm type={'review'} id={review._id} />
        )}
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deleteReview, markReviewAsHelpful })(
  ReviewItem
);
