import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import SearchBar from '../Forms/SearchBar';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <NavLink to='/home'>Home</NavLink>
      </li>
      <li>
        <NavLink to='/dashboard'>Dashboard</NavLink>
      </li>
      <li>
        <NavLink to='/create'>Create Listing</NavLink>
      </li>
      <li>
        {' '}
        <a onClick={logout} href=''>
          <i className='fas fa-sign-out-alt' />{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
      <li>
        <SearchBar />
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <NavLink to='/home'>Home</NavLink>
      </li>
      <li>
        <NavLink to='/login'>Login</NavLink>
      </li>
      <li>
        <NavLink to='/register'>Register</NavLink>
      </li>
      <li>
        <SearchBar />
      </li>
    </ul>
  );

  return (
    <div>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
