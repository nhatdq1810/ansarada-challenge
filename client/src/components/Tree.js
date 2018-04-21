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
import ActionSettings from 'material-ui/svg-icons/action/settings';
import EditorFile from 'material-ui/svg-icons/editor/insert-drive-file';

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
      isFileInfoOpen: false,
      fileInfoAnchorEl: null,
      selectedFile: {},
    };
  }

  componentDidMount() {
    this.props.fetchDocuments();
  }

  itemClick = (item) => {
    if (item.children && item.children.length > 0) {
      this.props.toggleFolder(item.id);
    } else if (item.isFolder) {
      const { searchInput } = this.state;
      this.props.fetchDocuments({ search: searchInput, parentId: item.id });
    }
  }

  calcFileSize = (fileSize) => {
    if (fileSize > 1000000000) {
      return `${(fileSize / 1000000000).toFixed(3)}GB`;
    }
    if (fileSize > 1000000) {
      return `${(fileSize / 1000000).toFixed(3)}MB`;
    }
    if (fileSize > 1000) {
      return `${(fileSize / 1000).toFixed(3)}KB`;
    }
    return `${fileSize}B`;
  }

  openFileInfo = (event, selectedFile) => {
    this.setState({
      isFileInfoOpen: true,
      fileInfoAnchorEl: event.currentTarget,
      selectedFile: { ...selectedFile, fileSize: this.calcFileSize(selectedFile.fileSize) },
    });
  }

  closeFileInfo = () => {
    this.setState({ isFileInfoOpen: false });
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
                      : <EditorFile color="red" />
                  } <span className="tree-item-number">{child.number}</span> <span className="tree-item-name">{child.name}</span>
                </FlatButton>
                {
                  hasChildren && child.isExpanded &&
                  this.renderChildren(child.children)
                }
                {
                  !child.isFolder &&
                  <IconButton className="icon-info" onClick={(event) => { this.openFileInfo(event, child); }}>
                    <ActionSettings />
                  </IconButton>
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
    const payload = searchInput === '' ? {} : { search: searchInput, includeChildren: 1 };
    this.props.fetchDocuments(payload);
  }

  openActions = (event) => {
    this.setState({ isActionsOpen: true, anchorEl: event.currentTarget });
  }

  closeActions = () => {
    this.setState({ isActionsOpen: false });
  }

  handleExpand = (event, value) => {
    if (value) {
      this.props.fetchDocuments({ search: this.state.searchInput, includeChildren: value });
    } else {
      this.props.toggleFolder(null);
    }
  }

  render() {
    const { searchInput, isActionsOpen, anchorEl, isFileInfoOpen, fileInfoAnchorEl, selectedFile } = this.state;

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
        <Popover
          open={isFileInfoOpen}
          anchorEl={fileInfoAnchorEl}
          onRequestClose={this.closeFileInfo}
        >
          <div className="file-info">
            <EditorFile color="red" />
            <div className="file-info-detail">
              <p className="file-info-detail-name">{selectedFile.name}</p>
              <small className="file-info-detail-size">{selectedFile.fileSize}</small>
            </div>
          </div>
        </Popover>
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