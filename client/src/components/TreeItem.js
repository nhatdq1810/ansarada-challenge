import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import EditorFile from 'material-ui/svg-icons/editor/insert-drive-file';
import IconButton from 'material-ui/IconButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';

import './TreeItem.css';

class TreeItem extends PureComponent {
  itemClick = () => {
    this.props.itemClick(this.props.item);
  }

  openFileInfo = (event) => {
    this.props.openFileInfo(event, this.props.item);
  }

  render() {
    const { item } = this.props;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li className="tree-item-wrapper">
        <FlatButton
          className={`${item.isFolder ? 'tree-item tree-item-folder' : 'tree-item'}`}
          onClick={this.itemClick}
        >
          {
            item.isFolder
              ? (
                item.isExpanded
                  ? <i className="tree-item-icon">&#9660;</i>
                  : <i className="tree-item-icon">&#9658;</i>
              )
              : <EditorFile color="red" />
          } <span className="tree-item-number">{item.number}</span> <span className="tree-item-name">{item.name}</span>
        </FlatButton>
        {
          hasChildren && item.isExpanded &&
          this.props.renderChildren(item.children)
        }
        {
          !item.isFolder &&
          <IconButton className="icon-info" onClick={this.openFileInfo}>
            <ActionSettings />
          </IconButton>
        }
      </li>
    );
  }
}

TreeItem.propTypes = {
  item: PropTypes.object.isRequired,
  itemClick: PropTypes.func.isRequired,
  renderChildren: PropTypes.func.isRequired,
  openFileInfo: PropTypes.func.isRequired,
};

export default TreeItem;