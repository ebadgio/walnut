import React from 'react';
import PropTypes from 'prop-types';
import Notification from 'react-web-notification';

class NotificationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ignore: true
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
    document.getElementById('sound').play();
  }

  render() {
    console.log('rendering notification', this.props.notif);
    return (
            <div className="textBoxDiv">
                <Notification
                    ignore={this.props.notif.ignore && this.props.notif.title === ''}
                    onClick={() => this.notifClick()}
                    onClose={() => this.notifClose()}
                    onShow={() => this.notifShow()}
                    timeout={5000}
                    title={this.props.notif.title}
                    options={this.props.notif.options}
                />
            <audio id="sound" preload="auto">
                <source src="/sounds/button_tiny.mp3" type="audio/mpeg" />
                <source src="/sounds/button_tiny.ogg" type="audio/ogg" />
                <embed hidden="true" autostart="false" loop="false" src="/sounds/button_tiny.mp3" />
            </audio>
            </div>
        );
  }
}

NotificationContainer.propTypes = {
  notif: PropTypes.object,
  notifClear: PropTypes.func
};

export default NotificationContainer;
