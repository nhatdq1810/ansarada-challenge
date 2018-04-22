import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover/Popover';
import { Menu, MenuItem } from 'material-ui/Menu';

import './Actions.css';

class Actions extends PureComponent {
  render() {
    const { openActions, isActionsOpen, anchorEl, closeActions, handleExpand } = this.props;
    return (
      <Fragment>
        <RaisedButton className="actions-select" label="Actions" onClick={openActions} />
        <Popover open={isActionsOpen} anchorEl={anchorEl} onRequestClose={closeActions}>
          <Menu onChange={handleExpand}>
            <MenuItem value={1} primaryText="Expand all" />
            <MenuItem value={0} primaryText="Collapse all" />
          </Menu>
        </Popover>
      </Fragment>
    );
  }
}

Actions.propTypes = {
  openActions: PropTypes.func.isRequired,
  isActionsOpen: PropTypes.bool.isRequired,
  anchorEl: PropTypes.object,
  closeActions: PropTypes.func.isRequired,
  handleExpand: PropTypes.func.isRequired,
};

Actions.defaultProps = {
  anchorEl: null,
}

export default Actions;