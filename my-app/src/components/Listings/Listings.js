import React, { Fragment, useEffect } from 'react';
import { getListings } from '../../actions/listing';
import { connect } from 'react-redux';
import ListItem from './ListItem';
import { clearListings } from '../../actions/listing';
import PaginationButtons from '../Layout/PaginationButtons';
import { Helmet } from 'react-helmet';
const queryString = require('query-string');

export const Listings = ({
  getListings,
  match,
  location,
  clearListings,
  listings: { loading, data, numListings }
}) => {
  useEffect(() => {
    getListings(location.search);
    return () => {
      clearListings();
    };
  }, [getListings]);

  const parsed = queryString.parse(location.search);

  return loading || data === null ? (
    <div>Loading..</div>
  ) : (
    <div>
      <Helmet>
        <title>Browsing listings | Auction</title>
      </Helmet>
      <h1>Listings</h1>
      <h3>
        Found {numListings} results searching for{' '}
        {parsed.search ? `'${parsed.search}'` : 'all listings'}{' '}
        {parsed.category ? `in  the category '${parsed.category}'` : ''}
        {/* {location.search.split('=')[1] == null
          ? ' all listings'
          : ` '${location.search.split('=')[1]}'`}{' '} */}
      </h3>
      {data.map(listing => (
        <ListItem key={listing._id} listing={listing} />
      ))}
      <PaginationButtons
        numListings={numListings}
        parsed={parsed}
        query={location.search}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  listings: state.listings
});

export default connect(mapStateToProps, { getListings, clearListings })(
  Listings
);
