import React from 'react';
import PropTypes from 'prop-types';
import firebaseApp from '../../firebase';
import { connect } from 'react-redux';
import _ from 'underscore';
import Notification from 'react-web-notification';

class NotificationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ignore: true
    };
  }

  componentDidMount() {
    if (this.props.newPost) {
      console.log('inside new post notif');
      this.setState({
        // Title becomes conversation title
        title: this.props.post.username,
        options: {
          body: this.props.post.content,
          lang: 'en',
          dir: 'ltr',
          icon: 'https://s3.amazonaws.com/walnut-logo/logo.svg'
        },
        ignore: false
      });
      setTimeout(() => {this.props.clearNewPostData();}, 5000);
    } else {
      const user = firebaseApp.auth().currentUser;
      const messagesRef = firebaseApp.database().ref('/messages/' + this.props.postData.postId).orderByKey().limitToLast(20);
      messagesRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          const send = _.values(snapshot.val());
          const newMessage = send[send.length - 1];
          console.log('inside here', newMessage);
          if (newMessage.authorId !== user.uid) {
            console.log('other user', this.props.postData.postId);
            this.setState({
              title: newMessage.author,
              options: {
                body: newMessage.content,
                lang: 'en',
                dir: 'ltr',
                icon: 'https://s3.amazonaws.com/walnut-logo/logo.svg'
              },
              ignore: false
            });
          }
        }
      });
    }
  }

  notifClick() {
    window.focus();
    this.setState({ title: '', options: {}, ignore: true });
  }

  notifClose() {
    this.setState({ title: '', options: {}, ignore: true });
  }

  notifShow() {
    document.getElementById('sound').play();
  }

  render() {
    console.log('notification rendering', this.state);
    return (
            <div className="textBoxDiv">
                <Notification
                    ignore={this.state.ignore && this.state.title === ''}
                    disableActiveWindow
                    onClick={() => this.notifClick()}
                    onClose={() => this.notifClose()}
                    onShow={() => this.notifShow()}
                    timeout={5000}
                    title={this.state.title}
                    options={this.state.options}
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
  postData: PropTypes.object,
  newPost: PropTypes.bool,
  post: PropTypes.object,
  clearNewPostData: PropTypes.func
};

const mapDispatchToProps = (dispatch) => ({
  clearNewPostData: () => dispatch({type: 'CLEAR_NEW_POST_NOTIFICATION'})
});

export default connect(null, mapDispatchToProps)(NotificationContainer);
