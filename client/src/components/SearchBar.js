import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import './SearchBar.css';

class SearchBar extends PureComponent {
  render() {
    const { inputSearch, searchInput, search } = this.props;
    return (
      <div className="search-bar">
        <TextField className="input-search" hintText="Search ..." onChange={inputSearch} value={searchInput} />
        <IconButton className="icon-search" onClick={search}>
          <KeyboardArrowRight />
        </IconButton>
      </div>
    );
  }
}

SearchBar.propTypes = {
  inputSearch: PropTypes.func.isRequired,
  searchInput: PropTypes.string.isRequired,
  search: PropTypes.func.isRequired,
};

export default SearchBar;