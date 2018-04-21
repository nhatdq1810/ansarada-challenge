import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { getDocuments } from '../selectors';
import { actions } from '../actions';
import './Tree.css';

class Tree extends PureComponent {
  componentDidMount() {
    this.props.fetchDocuments();
  }

  itemClick = (parentId) => {
    this.props.fetchDocuments({ parentId });
  }

  renderChildren = (children) => {
    return (
      <ul>
        {
          children.map((child) => {
            const isHasChildren = child.children && child.children.length > 0;

            return (
              <li key={`${child.number}-${child.name}`}>
                <button
                  className={`${child.isFolder ? 'tree-item tree-item-folder' : 'tree-item'}`}
                  onClick={() => { this.itemClick(child.id); }}
                >
                  {
                    child.isFolder ?
                      (
                        isHasChildren ?
                          <i className="tree-item-icon">&#9660;</i>
                          : <i className="tree-item-icon">&#9658;</i>
                      )
                      : null
                  } <span className="tree-item-number">{child.number}</span> <span className="tree-item-name">{child.name}</span>
                </button>
                {
                  isHasChildren &&
                  this.renderChildren(child.children)
                }
              </li>
            );
          })
        }
      </ul>
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderChildren(this.props.documents)}
      </Fragment>
    );
  }
}

Tree.propTypes = {
  fetchDocuments: PropTypes.func.isRequired,
  documents: PropTypes.array.isRequired,
}

const mapStateToProps = createStructuredSelector({
  documents: getDocuments,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDocuments(payload) {
      dispatch(actions.fetchDocuments.start(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tree);