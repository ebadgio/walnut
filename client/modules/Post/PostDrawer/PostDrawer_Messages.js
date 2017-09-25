import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Comment from '../Post_Comment';
import '../Post.css';
import {  Loader } from 'semantic-ui-react';
import firebaseApp from '../../../firebase';
import uuidv4 from 'uuid/v4';
import _ from 'underscore';
import $ from 'jquery';
import InfiniteScroll from 'react-infinite-scroller';

class PostDrawerMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      messages: [],
      hitBottom: false,
      c: 0
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.startListen = this.startListen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    console.log('message box mounted', this.props, this.state);
    const user = firebaseApp.auth().currentUser;
    this.setState({user: user});
    this.startListen(this.props.postData, user);
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault();
      if (this.state.user) {
        const updates2 = {};
        updates2['/members/' + this.props.postData.postId + '/' + user.uid] = null;
        firebaseApp.database().ref().update(updates2);
        const updatesEx = {};
        updatesEx['/typers/' + this.state.postData.postId + '/' + user.uid] = null;
        firebaseApp.database().ref().update(updatesEx);
      }
    });
  }

  componentWillUnmount() {
    this.handleClose();
  }

  startListen(data, user) {
    const scrollable = document.querySelector('.messagesBox');

    scrollable.addEventListener('wheel', (event) => {
      const deltaY = event.deltaY;
      const contentHeight = scrollable.scrollHeight;
      const visibleHeight = scrollable.offsetHeight;
      const scrollTop = scrollable.scrollTop;

      if (scrollTop === 0 && deltaY < 0) {
        event.preventDefault();
      } else if (visibleHeight + scrollTop === contentHeight && deltaY > 0) {
        event.preventDefault();
      }
    });
    const updates = {};
    const member = {
      name: user.displayName,
      avatar: this.props.currentUser.pictureURL,
      uid: user.uid
    };
    updates['/members/' + data.postId + '/' + user.uid] = member;
    firebaseApp.database().ref().update(updates);


    const followsRef = firebaseApp.database().ref('/follows/' + user.uid + '/' + this.props.currentUser.currentCommunity._id + '/' +  data.postId);
    followsRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        const unreadsCountRef = firebaseApp.database().ref('/unreads/' + user.uid + '/' + data.postId);
        unreadsCountRef.transaction((currentValue) => {
          return 0;
        });
      }
    });

    if (data.postId) {
      const messagesRef = firebaseApp.database().ref('/messages/' + this.props.postData.postId).orderByKey().limitToLast(20);
      messagesRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          const send = _.values(snapshot.val());
          const ID = send[0].authorId + '' + send[0].content;
          const bottomID = send[send.length - 1].authorId + '' + send[send.length - 1].content;
          if (send.length > 19) {
            this.setState({
              messages: send,
              firstKey: Object.keys(snapshot.val())[0],
              firstId: ID,
              hasMore: true,
              hitBottom: false
            });
          } else {
            this.setState({
              messages: send,
              firstKey: Object.keys(snapshot.val())[0],
              firstId: ID,
              hasMore: false,
              hitBottom: true
            });
          }
          if (this.state.c === 0 || send[send.length - 1].authorId === user.uid) {
            this.scrollToBottom(bottomID);
          }
        } else {
          this.setState({messages: [], hitBottom: true, hasMore: false});
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
    const scrolling = document.getElementById('scrolling');
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
    if (this.state.hitBottom && !this.state.wait) {
      if (data.postId) {
        const messagesRef = firebaseApp.database().ref('/messages/' + data.postId).orderByKey()
                    .endAt(this.state.firstKey).limitToLast(20);
        messagesRef.once('value', (snapshot) => {
          const newOnes = _.values(snapshot.val());
          newOnes.pop();
          const concat = newOnes.concat(this.state.messages);
          const more = newOnes.length > 0;
          const newId = (newOnes.length > 0) ? newOnes[0].authorId + '' + newOnes[0].content : '';
          this.setState({ messages: concat, firstKey: Object.keys(snapshot.val())[0], firstId: newId, hitBottom: false, hasMore: more, wait: true });
                    // const scrollAmount = newOnes.length * 90 + 90;
          if (newId) {
            this.scrollToBottom(oldId);
          }
          setTimeout(() => {this.setState({wait: false});}, 750);
        });
      } else {
        console.log('missing postData load more');
      }
    } else {
      console.log('oops havent hit bottom yet :/');
    }
  }

  handleClose() {
    console.log('succesful will unmount');
    if (this.state.user) {
      this.setState({
        hitBottom: false,
        messages: [],
        firstKey: null,
        firstId: null,
        c: 0
      });
      const updates = {};
      updates['/members/' + this.props.postData.postId + '/' + this.state.user.uid] = null;
      firebaseApp.database().ref().update(updates);

      const updatesEx = {};
      updatesEx['/typers/' + this.props.postData.postId + '/' + this.state.user.uid] = null;
      firebaseApp.database().ref().update(updatesEx);
    }
  }

  render() {
    return (
        <div className="messagesBox">
            <InfiniteScroll
                style={{display: 'flex', flexDirection: 'column'}}
                pageStart={0}
                loadMore={() => this.loadMore(this.props.postData)}
                hasMore={this.state.hasMore}
                isReverse
                threshold={50}
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
        </div>
        );
  }
}
PostDrawerMessages.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object,
};

export default PostDrawerMessages;
