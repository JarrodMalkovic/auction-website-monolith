import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createReview } from '../../actions/review';
import { connect } from 'react-redux';

const ReviewForm = ({ createReview, match, history }) => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    rating: 1
  });

  const { title, text, rating } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    createReview(match.params.id, title, text, rating, history);
  };
  return (
    <div>
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

ReviewForm.propTypes = {};

export default connect(null, { createReview })(ReviewForm);
