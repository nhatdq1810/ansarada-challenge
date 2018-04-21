import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Popover from 'material-ui/Popover/Popover';
import { Menu, MenuItem } from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { getDocuments } from '../selectors';
import { actions } from '../actions';
import './Tree.css';

class Tree extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
      isActionsOpen: false,
      anchorEl: null,
    };
  }

  componentDidMount() {
    this.props.fetchDocuments();
  }

  itemClick = (item) => {
    if (item.children && item.children.length > 0) {
      this.props.toggleFolder(item.id);
    } else {
      const { searchInput } = this.state;
      this.props.fetchDocuments({ search: searchInput, parentId: item.id });
    }
  }

  renderChildren = (children) => {
    return (
      <ul>
        {
          children.map((child) => {
            const hasChildren = child.children && child.children.length > 0;

            return (
              <li className="tree-item-wrapper" key={`${child.number}-${child.name}`}>
                <FlatButton
                  className={`${child.isFolder ? 'tree-item tree-item-folder' : 'tree-item'}`}
                  onClick={() => { this.itemClick(child); }}
                >
                  {
                    child.isFolder ?
                      (
                        child.isExpanded ?
                          <i className="tree-item-icon">&#9660;</i>
                          : <i className="tree-item-icon">&#9658;</i>
                      )
                      : null
                  } <span className="tree-item-number">{child.number}</span> <span className="tree-item-name">{child.name}</span>
                </FlatButton>
                {
                  hasChildren && child.isExpanded &&
                  this.renderChildren(child.children)
                }
              </li>
            );
          })
        }
      </ul>
    );
  }

  inputSearch = (event) => {
    this.setState({ searchInput: event.target.value });
  }

  search = () => {
    const { searchInput } = this.state;
    this.props.fetchDocuments({ search: searchInput });
  }

  changeIncludeChildren = (event, index, value) => {
    this.props.fetchDocuments({ includeChildren: value });
  }

  openActions = (event) => {
    this.setState({ isActionsOpen: true, anchorEl: event.currentTarget });
  }

  closeActions = () => {
    this.setState({ isActionsOpen: false });
  }

  handleExpand = (event, value) => {
    this.props.fetchDocuments({ includeChildren: value });
  }

  render() {
    const { searchInput, isActionsOpen, anchorEl } = this.state;

    return (
      <Fragment>
        <div className="actions">
          <div className="search-bar">
            <TextField className="input-search" hintText="Search ..." onChange={this.inputSearch} value={searchInput} />
            <IconButton className="icon-search" onClick={this.search}>
              <KeyboardArrowRight />
            </IconButton>
          </div>
          <RaisedButton className="actions-select" label="Actions" onClick={this.openActions} />
          <Popover open={isActionsOpen} anchorEl={anchorEl} onRequestClose={this.closeActions}>
            <Menu onChange={this.handleExpand}>
              <MenuItem value={1} primaryText="Expand all" />
              <MenuItem value={0} primaryText="Collapse all" />
            </Menu>
          </Popover>
        </div>
        {this.renderChildren(this.props.documents)}
      </Fragment>
    );
  }
}

Tree.propTypes = {
  fetchDocuments: PropTypes.func.isRequired,
  documents: PropTypes.array.isRequired,
  toggleFolder: PropTypes.func.isRequired,
}

const mapStateToProps = createStructuredSelector({
  documents: getDocuments,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDocuments(payload) {
      dispatch(actions.fetchDocuments.start(payload));
    },
    toggleFolder(payload) {
      dispatch(actions.toggleFolder(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tree);