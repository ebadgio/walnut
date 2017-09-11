import React from 'react';
import PropTypes from 'prop-types';
import './Post.css';
import { Icon, Modal } from 'semantic-ui-react';
import firebaseApp from '../../firebase';
import _ from 'underscore';
import PostModalMessages from './Post_Modal_Messages.js';
import ModalTextBox from './Post_Modal_TextBox';
import ModalHeader from './Post_Modal_Header.js';

class ModalInstance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      unread: 0,
      emojiIsOpen: false
    };
  }

  componentDidMount() {
    const user = firebaseApp.auth().currentUser;
    this.setState({ user: user });
    // BUG ON MISSING DISPLAY NAME
    const membersRef = firebaseApp.database().ref('/members/' + this.props.postData.postId);
    membersRef.on('value', (snapshot) => {
      const peeps =  _.values(snapshot.val());
      const members = peeps.filter((peep) => typeof (peep) === 'object');
      this.setState({membersCount: members.length, members: members});
    });
    const countRef = firebaseApp.database().ref('/counts/' + this.props.postData.postId + '/count');
    countRef.on('value', (snapshot) => {
      this.setState({count: snapshot.val()});
    });
    // notification stuff
    const userId = firebaseApp.auth().currentUser.uid;
    firebaseApp.database().ref('/unreads/' + userId + '/' + this.props.postData.postId).on('value', snapshotB => {
      const unreadCount =  snapshotB.val();
      if (!isNaN(unreadCount)) {
        if (unreadCount > 0) {
          this.setState({unread: unreadCount});
          console.log('unread set to true');
        }
      }
    });

    // taking users out of chat when they close the window with modal still open
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault();
      if (this.state.user) {
        const updates2 = {};
        updates2['/members/' + this.props.postData.postId + '/' + this.state.user.uid] = null;
        firebaseApp.database().ref().update(updates2);
      }
    });
  }

  render() {
    console.log('unread messages total ?', this.state.unread);
    return (
      <Modal
             size={'small'}
             basic
             trigger={
        <div className="commentDiv">
          <span className="userNum">{this.state.membersCount > 0 ? this.state.membersCount : ''}</span>
          <Icon size="big" name="users" className={this.props.mini ? 'usersIconMini' : 'usersIcon' } />
          <span className={(this.state.unread > 0) ? 'commentNumUn' : 'commentNum'}>{this.state.unread > 0 ? this.state.unread : this.state.count}</span>
          <Icon size="big" name="comments" className={this.props.mini ? 'commentIconMini' : 'commentIcon'} />
        </div>}
        closeIcon="close"
        >
        <Modal.Header className="modalHeader">
          <ModalHeader members={this.state.members} membersCount={this.state.membersCount} user={this.state.user} postData={this.props.postData}/>
        </Modal.Header>
        <Modal.Content scrolling className="scrollContentClass">
          <PostModalMessages user={this.state.user} postData={this.props.postData} />
        </Modal.Content>
        <Modal.Actions className="modalActions">
          <ModalTextBox user={this.state.user} members={this.state.members} postData={this.props.postData} handleChange={(e) => this.handleChange(e)} findEnter={() =>this.findEnter()} />
        </Modal.Actions>
      </Modal>
    );
  }
}
ModalInstance.propTypes = {
  postData: PropTypes.object,
  onClick: PropTypes.func,
  currentUser: PropTypes.object,
  startListen: PropTypes.func,
  joinConversation: PropTypes.func,
  mini: PropTypes.bool
};

export default ModalInstance;
