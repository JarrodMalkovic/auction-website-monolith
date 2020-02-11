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
        <NavLink to='/home'>
          <i className='fas fa-home' /> <span className='hide-sm'>Home</span>
        </NavLink>
      </li>
      <li>
        <NavLink to='/dashboard'>
          <i className='fas fa-id-card' />{' '}
          <span className='hide-sm'>Dashboard</span>
        </NavLink>
      </li>
      <li>
        <NavLink to='/create'>
          <i className='fas fa-plus-circle' />{' '}
          <span className='hide-sm'>Create listing</span>
        </NavLink>
      </li>
      <li>
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
        <NavLink to='/home'>
          <i className='fas fa-home' /> <span className='hide-sm'>Home</span>
        </NavLink>
      </li>
      <li>
        <NavLink to='/login'>
          <i className='fas fa-sign-in-alt' />{' '}
          <span className='hide-sm'>Login</span>
        </NavLink>
      </li>
      <li>
        <NavLink to='/register'>
          <i class='fas fa-user-plus'></i>{' '}
          <span className='hide-sm'>Register</span>
        </NavLink>
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
