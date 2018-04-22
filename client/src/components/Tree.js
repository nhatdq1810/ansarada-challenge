import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Popover from 'material-ui/Popover/Popover';
import EditorFile from 'material-ui/svg-icons/editor/insert-drive-file';

import { getDocuments } from '../selectors';
import { actions } from '../actions';
import TreeItem from './TreeItem';
import SearchBar from './SearchBar';
import Actions from './Actions';
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
      return `${(fileSize / 1000000000).toFixed(3)} GB`;
    }
    if (fileSize > 1000000) {
      return `${(fileSize / 1000000).toFixed(3)} MB`;
    }
    if (fileSize > 1000) {
      return `${(fileSize / 1000).toFixed(3)} KB`;
    }
    return `${fileSize} B`;
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
            return (
              <TreeItem
                key={`${child.number}-${child.name}`}
                item={child}
                itemClick={this.itemClick}
                renderChildren={this.renderChildren}
                openFileInfo={this.openFileInfo}
              />
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
        <div className="utils">
          <SearchBar inputSearch={this.inputSearch} searchInput={searchInput} search={this.search} />
          <Actions
            openActions={this.openActions}
            isActionsOpen={isActionsOpen}
            anchorEl={anchorEl}
            closeActions={this.closeActions}
            handleExpand={this.handleExpand}
          />
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