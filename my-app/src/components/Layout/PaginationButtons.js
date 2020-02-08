import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getListings, clearListings } from '../../actions/listing';
const queryString = require('query-string');

const PaginationButtons = ({
  parsed,
  query,
  numListings,
  getListings,
  clearListings
}) => {
  const page = parsed.page || 1;
  const limit = parsed.limit || 10;
  const lastPage = Math.ceil(numListings / limit);
  let history = useHistory();
  var search = '';

  const onClick = num => {
    clearListings();
    parsed.page = num;
    parsed.limit = limit;
    const stringified = '?' + queryString.stringify(parsed);
    // search = '';
    // console.log(parsed.page == undefined);
    // console.log(stringified);
    // if (parsed.page == undefined) {
    //   stringified === '?'
    //     ? (search = stringified + `limit=${limit}&page=${num}`)
    //     : (search = stringified + `&limit=${limit}&page=${num}`);
    // } else {
    search = stringified;
    // }

    history.push(`/listings${search}`);
    getListings(search);
  };
  return (
    <div>
      {parsed.page > 1 && (
        <button onClick={() => onClick(parseInt(parsed.page) - 1)}>
          {'<'}
        </button>
      )}
      <button onClick={() => onClick(1)}>First Page</button>
      Page {parsed.page}
      <button onClick={() => onClick(lastPage)}>Last Page</button>
      {parseInt(parsed.page) < lastPage && (
        <button onClick={() => onClick(parseInt(parsed.page) + 1)}>
          {'>'}
        </button>
      )}
    </div>
  );
};

PaginationButtons.propTypes = {};

export default connect(null, { getListings, clearListings })(PaginationButtons);
