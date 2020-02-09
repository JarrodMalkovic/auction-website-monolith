import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { editListing, getListing, clearListing } from '../../actions/listing';
import { Redirect } from 'react-router-dom';
import ImageUpload from '../Forms/ImageUpload';
import { Helmet } from 'react-helmet';

const EditListingPage = ({
  editListing,
  auth: { authLoading, user },
  match,
  history,
  getListing,
  clearListing,
  listing: { data, loading }
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minIncrement: '',
    category: '',
    length: '',
    condition: '',
    startPrice: '',
    image: ''
  });

  let {
    title,
    description,
    minIncrement,
    category,
    length,
    condition,
    startPrice,
    image
  } = formData;

  useEffect(() => {
    getListing(match.params.slug);
    return () => {
      clearListing();
    };
  }, [getListing]);

  const setParentImage = childImage => {
    setFormData({ ...formData, image: childImage });

    image = childImage;
    console.log(image);
  };

  useEffect(() => {
    setFormData({
      title: loading || !data.title ? '' : data.title,
      description: loading || !data.description ? '' : data.description,
      minIncrement: loading || !data.minIncrement ? '' : data.minIncrement,
      category: loading || !data.category ? '' : data.category,
      length: loading || !data.length ? '' : data.length,
      condition: loading || !data.condition ? '' : data.condition,
      startPrice: loading || !data.startPrice ? '' : data.startPrice,
      endDate: loading || !data.endDate ? '' : data.endDate
    });
  }, [loading, data]);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    console.log('edit');
    editListing(
      title,
      description,
      minIncrement,
      category,
      length,
      condition,
      startPrice,
      data._id,
      history
    );
  };

  if (!authLoading && data != null && user != null) {
    if (user._id != data.createdBy._id) {
      return <Redirect to='/dashboard' />;
    }
  }

  return loading || data === null ? (
    <div>Loading..</div>
  ) : (
    <Fragment>
      <Helmet>
        <title>Edit listing | Auction</title>
      </Helmet>
      <h1>Edit Listing</h1>
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
            onChange={e => onChange(e)}
          />
        </div>

        <div className='form-group'>
          <input
            type='number'
            placeholder='Starting price'
            name='startPrice'
            value={startPrice}
            onChange={e => onChange(e)}
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
        <input type='submit' className='btn btn-primary' value='Edit Listing' />
      </form>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  listing: state.listing
});

export default connect(mapStateToProps, {
  getListing,
  clearListing,
  editListing
})(EditListingPage);
