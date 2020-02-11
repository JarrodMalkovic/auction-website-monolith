import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { getReview, clearReview, editReview } from '../../actions/review';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const EditReviewPage = ({
  getReview,
  match,
  auth,
  clearReview,
  history,
  editReview,
  review: { data, loading, errors }
}) => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    rating: 1
  });

  const { title, text, rating } = formData;

  useEffect(() => {
    console.log(match.params.id);
    console.log(data);
    getReview(match.params.id);
    return () => {
      clearReview();
    };
  }, [getReview]);

  useEffect(() => {
    setFormData({
      title: loading || !data.title ? '' : data.title,
      text: loading || !data.text ? '' : data.text,
      rating: loading || !data.rating ? '' : data.rating
    });
  }, [loading, data]);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    editReview(title, text, rating, data._id, history);
    console.log('edit');
  };

  if (
    !auth.loading &&
    data != null &&
    auth.user != null &&
    !loading &&
    !errors
  ) {
    if (auth.user._id != data.writtenBy) {
      console.log('data:');
      console.log(data);
      console.log(auth.user._id, data.writtenBy);
      console.log('redirect');
      clearReview();
      return <Redirect to='/dashboard' />;
    }
  }

  return (loading || data === null || auth.user === null || auth.loading) &&
    !errors ? (
    <div>Loading..</div>
  ) : errors ? (
    <div>No review found</div>
  ) : (
    <div>
      <Helmet>
        <title>Edit review | Auction</title>
      </Helmet>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <h1>Title of your review</h1>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Title of your review'
            name='title'
            value={title}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <h1>Rating out of 5</h1>
        <div>
          <select onChange={e => onChange(e)} name='rating' value={rating}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <div className='form-group'>
          <input
            type='textarea'
            placeholder='Enter your review'
            name='text'
            value={text}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input
          type='submit'
          className='btn btn-primary'
          value='Publish Review'
        />
      </form>
    </div>
  );
};

EditReviewPage.propTypes = {};

const mapStateToProps = state => ({
  review: state.review,
  auth: state.auth
});

export default connect(mapStateToProps, { getReview, clearReview, editReview })(
  EditReviewPage
);
