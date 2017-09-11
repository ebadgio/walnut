import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Comment from './Post_Comment';
import './Post.css';
import {  Loader } from 'semantic-ui-react';
import firebaseApp from '../../firebase';
import uuidv4 from 'uuid/v4';
import _ from 'underscore';
import InfiniteScroll from 'react-infinite-scroller';

class ModalMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      hitBottom: false,
      c: 0
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.startListen = this.startListen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    this.startListen(this.props.postData);
  }

  componentWillUnmount() {
    this.handleClose();
  }

  startListen(data) {
    const updates = {};
    const member = {
      name: this.props.user.displayName,
      avatar: this.props.currentUser.pictureURL,
      uid: this.props.user.uid
    };
    updates['/members/' + this.props.postData.postId + '/' + this.props.user.uid] = member;
    firebaseApp.database().ref().update(updates);

    // TODO: this needs to change upper scope unreads
      // unread messages stuff
    firebaseApp.database().ref('/unreads/' + this.props.user.uid + '/' + this.props.postData.postId).set(0);
    this.setState({ unread: 0 });
      // unread stuff ends

    if (data.postId) {
      const messagesRef = firebaseApp.database().ref('/messages/' + data.postId).orderByKey().limitToLast(20);
      messagesRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          console.log('still coming', snapshot.val());
          const send = _.values(snapshot.val());
          const ID = send[0].authorId + '' + send[0].content;
          const bottomID = send[send.length - 1].authorId + '' + send[send.length - 1].content;
          this.setState({
            messages: send,
            firstKey: Object.keys(snapshot.val())[0],
            firstId: ID,
            hasMore: true,
            hitBottom: true
          });
          if (this.state.c === 0 || send[send.length - 1].authorId === this.props.user.uid) {
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

  scrollToBottom(id) {
        // $('.scrolling').scrollTop(50000);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView();
      this.setState({ hitBottom: true, c: this.state.c + 1 });
    } else {
            // $('.scrolling').scrollTop(100000);
      this.setState({ hitBottom: true, c: this.state.c + 1 });
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
          this.setState({ messages: concat, firstKey: Object.keys(snapshot.val())[0], firstId: newId, hitBottom: false, hasMore: more });
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

  handleClose() {
    if (this.props.user) {
      const updates = {};
      updates['/members/' + this.props.postData.postId + '/' + this.props.user.uid] = null;
      firebaseApp.database().ref().update(updates);

      const updatesEx = {};
      updatesEx['/typers/' + this.props.postData.postId + '/' + this.props.user.uid] = null;
      firebaseApp.database().ref().update(updatesEx);

      this.setState({
        hitBottom: false,
        messages: [],
        firstKey: null,
        firstId: null,
        c: 0
      });
    }
  }

  render() {
    console.log('attachment in messages', this.state.messages);
    return (
        <InfiniteScroll
            pageStart={0}
            loadMore={() => { this.loadMore(this.props.postData); }}
            hasMore={this.state.hasMore}
            isReverse
            threshold={25}
            loader={<Loader active inline="centered" />}
            useWindow={false}
        >
            {this.state.messages.map((message) => (
                <Comment
                    id={message.authorId + '' + message.content}
                    key={uuidv4()}
                    name={message.author}
                    createdAt={message.createdAt}
                    content={message.content}
                    authorPhoto={message.authorPhoto}
                    currentUser={this.props.currentUser}
                    authorId={message.authorId}
                    attachment={message.attachment}
                />
            ))}
        </InfiniteScroll>
        );
  }
}
ModalMessages.propTypes = {
  postData: PropTypes.object,
  currentUser: PropTypes.object,
  user: PropTypes.object
};
const mapStateToProps = (state) => ({
  currentUser: state.userReducer
});
export default connect(mapStateToProps, null)(ModalMessages);
