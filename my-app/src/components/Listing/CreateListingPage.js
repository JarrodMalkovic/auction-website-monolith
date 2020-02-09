import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createListing } from '../../actions/listing';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ImageUpload from '../Forms/ImageUpload';
import { Helmet } from 'react-helmet';

const CreateListingPage = ({ createListing, history, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minIncrement: '',
    category: '',
    length: '',
    condition: 'used',
    startPrice: '',
    image: ''
  });

  const [endDate, setEndDate] = useState(new Date());

  let {
    title,
    description,
    minIncrement,
    category,
    condition,
    startPrice,
    image
  } = formData;

  useEffect(() => {
    setFormData({
      title: '',
      description: '',
      minIncrement: '',
      category: '',
      length: '',
      condition: 'Used',
      startPrice: ''
    });
  }, [isAuthenticated]);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    createListing(
      title,
      description,
      minIncrement,
      category,
      endDate,
      condition,
      startPrice,
      image,
      history
    );
  };

  const setParentImage = childImage => {
    setFormData({ ...formData, image: childImage });
    image = childImage;
  };

  return (
    <Fragment>
      <Helmet>
        <title>Create Listing | Auction</title>
      </Helmet>
      <h1>Create Listing</h1>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Name of Item'
            name='title'
            value={title}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <ImageUpload setParentImage={setParentImage} />
        <div>
          <select
            onChange={e => onChange(e)}
            name='condition'
            value={condition}
          >
            <option value='used'>Used</option>
            <option value='new'>New</option>
          </select>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='*category'
            name='category'
            value={category}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='number'
            placeholder='Minimum Increment'
            name='minIncrement'
            value={minIncrement}
            onChange={e => {
              if (
                /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/.test(e.target.value) ||
                e.target.value == ''
              ) {
                setFormData({ ...formData, minIncrement: e.target.value });
              }
            }}
          />
        </div>
        <div>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            minDate={new Date()}
            dateFormat='MMMM d, yyyy'
          />
        </div>
        <div className='form-group'>
          <input
            type='textarea'
            placeholder='Description'
            name='description'
            value={description}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='number'
            placeholder='Starting price'
            name='startPrice'
            value={startPrice}
            onChange={e => {
              if (
                /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/.test(e.target.value) ||
                e.target.value == ''
              ) {
                setFormData({ ...formData, startPrice: e.target.value });
              }
            }}
          />
        </div>

        <input
          type='submit'
          className='btn btn-primary'
          value='Create Listing'
        />
      </form>
    </Fragment>
  );
};

CreateListingPage.propTypes = {};

export default connect(null, { createListing })(CreateListingPage);
