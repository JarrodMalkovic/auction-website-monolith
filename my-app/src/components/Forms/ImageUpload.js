import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { addImage } from '../../actions/imageActions';
import { connect } from 'react-redux';
import axios from 'axios';

const ImageUpload = ({ addImage, setParentImage }) => {
  const [imageData, setImageData] = useState({
    file: ''
  });
  const { file } = imageData;

  const onChange = e => {
    console.log(e.target.files[0]);
    setImageData({ file: e.target.files[0] });
  };

  const onSubmit = async e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('image', file);

    const res = await axios.post('/api/listings/upload/image', formData);
    setParentImage(res.data.url);
    console.log(res);
  };

  return (
    <div>
      <form
        className='form'
        encType='multipart/form-data'
        onSubmit={e => onSubmit(e)}
      >
        <div className='form-group'>
          <input type='file' name='file' multiple onChange={e => onChange(e)} />
        </div>
        <div className='form-group'>
          <input type='submit' className='btn btn-primary' value='Upload' />
        </div>
      </form>
    </div>
  );
};

ImageUpload.propTypes = {};

export default connect(null, { addImage })(ImageUpload);
