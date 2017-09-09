import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import newLikeThunk from '../../thunks/post_thunks/newLikeThunk';
import newCommentThunk from '../../thunks/post_thunks/newCommentThunk';
import newCommentLikeThunk from '../../thunks/post_thunks/newCommentLikeThunk';
import joinConversationThunk from '../../thunks/post_thunks/joinConversationThunk';
import './Post.css';
import { Icon, Modal, Button, Popup } from 'semantic-ui-react';
import firebaseApp from '../../firebase';
import _ from 'underscore';
import NestedPostModal from './Nested_Post_Modal';
import PostModalMessages from './Post_Modal_Messages.js';
import ModalTextBox from './Post_Modal_TextBox';
import { Picker } from 'emoji-mart';

class ModalInstance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentBody: '',
      messages: [],
      typers: [],
      members: [],
      hitBottom: false,
      c: 0,
      unread: 0,
      // TODO conversation.filter((conv) => conv._id === this.props.postData._id).length > 0
      isInConversation: false,
      modalOpen: false,
      emojiIsOpen: false
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentWillMount() {
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
    const updates = {};
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

  scrollToBottom(id) {
    // $('.scrolling').scrollTop(50000);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView();
      this.setState({hitBottom: true, c: this.state.c + 1});
    } else {
      // $('.scrolling').scrollTop(100000);
      this.setState({hitBottom: true, c: this.state.c + 1});
    }
    // } else {
    //   const bottom = document.getElementById('bottom');
    //   console.log('bottom', bottom);
    //   bottom.scrollIntoView();
    // }
  }

  loadMore(data) {
    // const elmnt = document.getElementById(this.state.firstId);
    // console.log('first ID', this.state.firstId, elmnt);
    const oldId = this.state.firstId;
    if (this.state.hitBottom) {
      if (data.postId) {
        const messagesRef = firebaseApp.database().ref('/messages/' + data.postId).orderByKey()
                .endAt(this.state.firstKey).limitToLast(15);
        messagesRef.once('value', (snapshot) => {
          const newOnes = _.values(snapshot.val());
          newOnes.pop();
          const concat = newOnes.concat(this.state.messages);
          const more = newOnes.length > 0;
          const newId = (newOnes.length > 0) ? newOnes[0].authorId + '' + newOnes[0].content : '';
          this.setState({messages: concat, firstKey: Object.keys(snapshot.val())[0], firstId: newId, hitBottom: false, hasMore: more});
          // const scrollAmount = newOnes.length * 90 + 90;
          if (newId) {
            this.scrollToBottom(oldId);
          }
        });
      } else {
        console.log('missing postData load more');
      }
    } else {
      console.log('oops havent hit bottom yet :/');
    }
  }

  startListen(data) {
    this.setState({modalOpen: true});
    const updates = {};
    const user = firebaseApp.auth().currentUser;
    this.setState({user: user});
    const member = {
      name: user.displayName,
      avatar: this.props.currentUser.pictureURL,
      uid: user.uid
    };
    updates['/members/' + this.props.postData.postId + '/' + user.uid] = member;
    firebaseApp.database().ref().update(updates);
    // unread messages stuff
    firebaseApp.database().ref('/unreads/' + user.uid + '/' + this.props.postData.postId).set(0);
    this.setState({unread: 0});
    // unread stuff ends


    setInterval(() => {
      if (this.state.commentBody) {
        if (this.state.commentBody !== this.state.prevBody) {
          if (this.state.did === 0) {
            const updaters = {};
            const typeInfo = {
              typer: user.displayName,
              typerId: user.uid,
              typerPhoto: this.props.currentUser.pictureURL
            };
            updaters['/typers/' + this.props.postData.postId + '/' + user.uid] = typeInfo;
            firebaseApp.database().ref().update(updaters);
          }
          this.setState({prevBody: this.state.commentBody, did: 1});
        } else {
          const updatesEx = {};
          updatesEx['/typers/' + this.props.postData.postId + '/' + user.uid] = null;
          firebaseApp.database().ref().update(updatesEx);
          this.setState({did: 0});
        }
      }}, 300);

    if (data.postId) {
      const messagesRef = firebaseApp.database().ref('/messages/' + data.postId).orderByKey().limitToLast(20);
      messagesRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          console.log('still coming', snapshot.val());
          const send = _.values(snapshot.val());
          const ID = send[0].authorId + '' + send[0].content;
          const bottomID = send[send.length - 1].authorId + '' + send[send.length - 1].content;
          this.setState({messages: send,
              firstKey: Object.keys(snapshot.val())[0],
              firstId: ID,
              hasMore: true,
              hitBottom: true});
          if (this.state.c === 0 || send[send.length - 1].authorId === user.uid) {
            this.scrollToBottom(bottomID);
          }
        } else {
          console.log('no snapshot val :(');
        }
      });
    } else {
      console.log('missing postData');
    }
  }

  watchForTypers() {
    const user = firebaseApp.auth().currentUser;
    const typersRef = firebaseApp.database().ref('/typers' + '/' + this.props.postData.postId);
    typersRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        const pairs = _.pairs(snapshot.val());
        const typers = pairs.filter((pair) => pair[1])
            .map((typer) => typer[1])
            .filter((obj) => obj.typerId !== user.uid);
        this.setState({typers: typers});
      } else {
        this.setState({typers: []});
      }
    });
  }

  handleClose() {
    this.setState({modalOpen: false});
    if (this.state.user) {
      const updates = {};
      updates['/members/' + this.props.postData.postId + '/' + this.state.user.uid] = null;
      firebaseApp.database().ref().update(updates);

      const updatesEx = {};
      updatesEx['/typers/' + this.props.postData.postId + '/' + this.state.user.uid] = null;
      firebaseApp.database().ref().update(updatesEx);

      this.setState({
        hitBottom: false,
        messages: [],
        firstKey: null,
        firstId: null,
        commentBody: '',
        prevBody: '',
        did: 0,
        c: 0
      });
    }
  }

  joinConversation() {
    console.log('inside here! firebase connection');
    const updates = {};
    updates['/follows/' + this.state.user.uid + '/' + this.props.currentUser.currentCommunity._id + '/' + this.props.postData.postId] = true;
    updates['/followGroups/' + this.props.postData.postId + '/' + this.state.user.uid] = true;
    console.log('updates', updates);
    firebaseApp.database().ref().update(updates);
  }

  leaveConversation() {
    const updates = {};
    updates['/follows/' + this.state.user.uid + '/' + this.props.currentUser.currentCommunity._id + '/' + this.props.postData.postId] = false;
    updates['/followGroups/' + this.props.postData.postId + '/' + this.state.user.uid] = false;
    firebaseApp.database().ref().update(updates);
  }

  render() {
    return (
      <Modal onOpen={() => {this.startListen(this.props.postData); this.watchForTypers();}}
             onClose={() => {this.handleClose();}}
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
        {this.state.emojiIsOpen ? <div className="emojiDiv">
          <Picker set="emojione"
            onClick={(emoj) => this.addEmoji(emoj)}
            title="Pick your emoji…" emoji="point_up"
            className="emojiContainer"
            emojiSize={24}
            perLine={9}
            skin={1}
            style={{
              width: '299px',
              height: '190px',
              overflowY: 'scroll',
              marginLeft: '232px',
              marginTop: '10px;',
              backgroundColor: 'black',
              padding: '4px'
            }}
            set="apple"
            autoFocus={false} />
        </div> : null}
        <Modal.Header className="modalHeader">
          <NestedPostModal postData={this.props.postData}
                           currentUser={this.props.currentUser}/>
          <Popup
            className="membersPopup"
            trigger={ <div className="inModalUsers">
              <span className="userNum">{this.state.membersCount > 0 ? this.state.membersCount : ''}</span>
              <Icon size="big" name="users" className="users" color="grey" />
            </div>}
            content={<div>{this.state.members.map((member) => <div className="imageWrapper messageAvatarOther popupAvatar">
              <img className="postUserImage" src={member.avatar} />
            </div>)}</div>}
            position="right center"
            inverted
            hoverable
            size={'small'}
          />
          {this.props.myConvoIds.indexOf(this.props.postData.postId) > -1 ?
          <div className="joinConversation">
            <Button
                onClick={() => this.leaveConversation()}
                circular
                id="leaveButton"
                animated="vertical">
              <Button.Content className="unfollowText">unFollow</Button.Content>
            </Button>
          </div> :
            <div className="joinConversation">
              <Button
                onClick={() => this.joinConversation()}
                circular
                id="joinButton"
                animated="vertical">
                <Button.Content visible>Follow</Button.Content>
                <Button.Content hidden>
                  <Icon name="plus" />
                </Button.Content>
              </Button>
            </div>
          }
        </Modal.Header>
        <Modal.Content scrolling className="scrollContentClass">
            <PostModalMessages />
        </Modal.Content>
        <Modal.Actions className="modalActions">
          <ModalTextBox inputBlock={()  => this.inputBlock()} handleChange={(e) => this.handleChange(e)} findEnter={() =>this.findEnter()} />
        </Modal.Actions>
      </Modal>
    );
  }
}
ModalInstance.propTypes = {
  postData: PropTypes.object,
  newComment: PropTypes.func,
  onClick: PropTypes.func,
  newLike: PropTypes.func,
  newCommentLike: PropTypes.func,
  currentUser: PropTypes.object,
  startListen: PropTypes.func,
  joinConversation: PropTypes.func,
  myConvoIds: PropTypes.array,
  mini: PropTypes.bool
};
const mapStateToProps = (state) => ({
  myConvoIds: state.conversationReducer.iDs,
});
const mapDispatchToProps = (dispatch) => ({
  newLike: (id) => newLikeThunk(id)(dispatch),
  joinConversation: (postId) => dispatch(joinConversationThunk(postId)),
  newComment: (commentBody, postId) => newCommentThunk(commentBody, postId)(dispatch),
  newCommentLike: (postId, commentId) => newCommentLikeThunk(postId, commentId)(dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(ModalInstance);
