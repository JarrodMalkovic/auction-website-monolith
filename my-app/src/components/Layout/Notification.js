import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addNotification } from '../../actions/notification';
import NotificationSystem from 'react-notification-system';

class Notification extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  componentWillReceiveProps(newProps) {
    const { message, level } = newProps.notification;
    this.notificationSystem.addNotification({
      level,
      message
    });
  }

  render() {
    return <NotificationSystem ref='notificationSystem' />;
  }
}

function mapStateToProps(state) {
  return {
    notification: state.notification
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        addNotification
      },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
