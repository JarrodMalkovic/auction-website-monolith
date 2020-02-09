import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getListings, clearListings } from '../../actions/listing';

const SearchBar = ({ getListings, clearListings }) => {
  const [formData, setFormData] = useState({
    query: '',
    category: 'No Category'
  });

  let { query, category } = formData;
  let history = useHistory();

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    clearListings();
    let search = '';
    if (query) {
      search = '?search=' + query.split(' ').join('+');
    }
    if (category !== '' && category !== 'No Category') {
      query === ''
        ? (search = '?category=' + category)
        : (search = search + '&category=' + category);
    }
    search === ''
      ? (search = `?limit=${10}&page=${1}`)
      : (search = search + `&limit=${10}&page=${1}`);

    history.push(`/listings${search}`);
    getListings(search);
  };

  return (
    <Fragment>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <select onChange={e => onChange(e)} name='category' value={category}>
            <option value='No Category'>No Category</option>
            <option value='Dog'>Dog</option>
            <option value='Cat'>Cat</option>
          </select>
          <input
            type='text'
            placeholder='Enter a search'
            name='query'
            value={query}
            onChange={e => onChange(e)}
          />
          <input type='submit' className='btn btn-primary' value='Search' />
        </div>
      </form>
    </Fragment>
  );
};

export default connect(null, { getListings, clearListings })(SearchBar);
