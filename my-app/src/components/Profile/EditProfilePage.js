import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserByToken, updateUserProfile } from '../../actions/user';
import { updatePassword } from '../../actions/auth';
import { Link } from 'react-router-dom';

const EditProfilePage = ({
  getUserByToken,
  updatePassword,
  updateUserProfile,
  isAuthenticated,
  user: { data, loading }
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const {
    name,
    email,
    location,
    bio,
    currentPassword,
    newPassword,
    confirmNewPassword
  } = formData;

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

  const handleUpdateProfile = async e => {
    e.preventDefault();
    updateUserProfile(name, email, location, bio);
  };

  const handleUpdatePassword = async e => {
    e.preventDefault();
    updatePassword(currentPassword, newPassword, confirmNewPassword);
  };

  return loading || data === null ? (
    <div>Loading..</div>
  ) : (
    <Fragment>
      <Link to={`/dashboard`}>
        <h4>Back to Dashboard</h4>
      </Link>
      <h1>Edit your Profile</h1>
      <h1>About You</h1>
      <form className='form' onSubmit={e => handleUpdateProfile(e)}>
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
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Edit Profile' />
      </form>
      <form className='form' onSubmit={e => handleUpdatePassword(e)}>
        <h1>Change Password</h1>
        <p>
          It's a good idea to use a strong password that you're not using
          elsewhere
        </p>
        <h3>Current Password</h3>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Current Password'
            name='currentPassword'
            value={currentPassword}
            onChange={e => onChange(e)}
          />
        </div>
        <h3>New Password</h3>
        <div className='form-group'>
          <input
            type='password'
            placeholder='New password'
            name='newPassword'
            value={newPassword}
            onChange={e => onChange(e)}
          />
        </div>
        <h3>Confirm new Password</h3>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm new Password'
            name='confirmNewPassword'
            value={confirmNewPassword}
            onChange={e => onChange(e)}
          />
        </div>
        <input
          type='submit'
          className='btn btn-primary'
          value='Update Password'
        />
      </form>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, {
  getUserByToken,
  updatePassword,
  updateUserProfile
})(EditProfilePage);
