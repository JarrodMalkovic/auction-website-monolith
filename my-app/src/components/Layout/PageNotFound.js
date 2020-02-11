import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const PageNotFound = props => {
  return (
    <div>
      <Helmet>
        <title>Page not found! | Auction</title>
      </Helmet>
      <p>Page not found!</p>
    </div>
  );
};

PageNotFound.propTypes = {};

export default PageNotFound;
