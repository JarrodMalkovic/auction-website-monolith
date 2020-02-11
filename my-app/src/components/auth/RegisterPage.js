import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../../actions/auth';
import { Helmet } from 'react-helmet';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = ({ register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const { email, name, password, passwordConfirm } = formData;

  const [verified, setVerified] = useState(false);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (verified) {
      register(name, email, password, passwordConfirm);
    } else {
      alert('Do the CAPTCHA');
    }
  };

  const verifyCallback = async e => {
    await setVerified(true);
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>Create an account | Auction</title>
      </Helmet>
      <h1 className='large text-primary'>Register</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Register an Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
            minLength='3'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='passwordConfirm'
            value={passwordConfirm}
            onChange={e => onChange(e)}
            minLength='3'
          />
        </div>
        <ReCAPTCHA
          sitekey='6Lcck9cUAAAAAIuHfUVETNVzklfJ6QkJ69V5tor0'
          onChange={verifyCallback}
        />

        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Log in</Link>
      </p>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { register })(Register);
