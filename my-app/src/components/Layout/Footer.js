import React from 'react';
import PropTypes from 'prop-types';

const Footer = props => {
  return (
    <footer className='footer'>
      <p className='small-text-white'>
        Created by Jarrod Malkovic using the MERN Stack. Find the code at:
        github.com
      </p>
    </footer>
  );
};

Footer.propTypes = {};

export default Footer;
