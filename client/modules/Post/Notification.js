import React from 'react';
import PropTypes from 'prop-types';
import Notification from 'react-web-notification';
import { connect } from 'react-redux';

class NotificationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  notifClick() {
    window.focus();
    this.props.notifClear();
  }

  notifClose() {
    this.props.notifClear();
  }

  notifShow() {
    document.getElementById('soundNot').play();
  }

  render() {
    return (
            <div className="textBoxDiv">
                <Notification
                    ignore={!this.props.isHidden}
                    onClick={() => this.notifClick()}
                    onClose={() => this.notifClose()}
                    onShow={() => this.notifShow()}
                    timeout={5000}
                    title={this.props.notif.title}
                    options={this.props.notif.options}
                />
            </div>
        );
  }
}

NotificationContainer.propTypes = {
  notif: PropTypes.object,
  notifClear: PropTypes.func,
  isHidden: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isHidden: state.notificationReducer.isHidden
});

export default connect(mapStateToProps, null)(NotificationContainer);
