import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserByToken, updateUserProfile } from '../../actions/user';
import { Link } from 'react-router-dom';

const EditProfilePage = ({
  getUserByToken,
  updateUserProfile,
  isAuthenticated,
  user: { data, loading }
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    bio: ''
  });

  const { name, email, password, location, bio } = formData;

  useEffect(() => {
    getUserByToken();
  }, [getUserByToken, isAuthenticated]);

  useEffect(() => {
    setFormData({
      name: loading || !data.name ? '' : data.name,
      email: loading || !data.email ? '' : data.email,
      password: loading || !data.password ? '' : data.password,
      location: loading || !data.location ? '' : data.location,
      bio: loading || !data.bio ? '' : data.bio
    });
  }, [loading, data]);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    updateUserProfile(name, email, password, location, bio);
  };

  return loading || data === null ? (
    <div>Loading..</div>
  ) : (
    <Fragment>
      <Link to={`/dashboard`}>
        <h4>Back to Dashboard</h4>
      </Link>
      <h1>Edit your Profile</h1>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <h3>Your name</h3>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Your Name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <h3>Your email</h3>
          <input
            type='text'
            placeholder='* Name of Item'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <h3>New Password</h3>
        <div className='form-group'>
          <input
            type='password'
            placeholder='New password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <h3>Your Biography</h3>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Enter a bio'
            name='bio'
            value={bio}
            onChange={e => onChange(e)}
          />
        </div>
        <h3>Your location</h3>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Location'
            name='location'
            value={location}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Edit Profile' />
      </form>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, { getUserByToken, updateUserProfile })(
  EditProfilePage
);
