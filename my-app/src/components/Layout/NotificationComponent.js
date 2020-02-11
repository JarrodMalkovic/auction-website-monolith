import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import Notifications from 'react-notification-system-redux';

class NotificationComponent extends React.Component {
  render() {
    const { notifications } = this.props;

    return <Notifications notifications={notifications} style={style} />;
  }
}

export default connect(state => ({ notifications: state.notifications }))(
  NotificationComponent
);
