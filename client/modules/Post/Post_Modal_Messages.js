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
    const user = firebaseApp.auth().currentUser;
    console.log('messages box mounted!', user);
    this.setState({user: user, postData: this.props.postData});
    setTimeout(() => this.startListen(this.props.postData), 500);
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault();
      if (this.state.user) {
        const updates2 = {};
        updates2['/members/' + this.props.postData.postId + '/' + user.uid] = null;
        firebaseApp.database().ref().update(updates2);
      }
    });
    setInterval(() => {
      if (this.props.postData.postId !== this.state.postData.postId) {
        console.log('difference found');
        this.startListen(this.props.postData);
        this.setState({postData: this.props.postData});
      }
    }, 500);
  }

  componentWillUnmount() {
    this.handleClose();
  }

  startListen(data) {
    const updates = {};
    const member = {
      name: this.state.user.displayName,
      avatar: this.props.currentUser.pictureURL,
      uid: this.state.user.uid
    };
    updates['/members/' + this.props.postData.postId + '/' + this.state.user.uid] = member;
    firebaseApp.database().ref().update(updates);
      // unread messages stuff
    firebaseApp.database().ref('/unreads/' + this.state.user.uid + '/' + this.props.postData.postId).set(0);
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
            hitBottom: false
          });
          if (this.state.c === 0 || send[send.length - 1].authorId === this.state.user.uid) {
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
    const scrolling = document.getElementById('scrolling');
    console.log('TRYING TO HIT BOTTOM', elem);
    if (elem) {
      console.log('scroll height', elem.scrollHeight);
      console.log('scrolling', scrolling.scrollTop);
      console.log('client height', scrolling.clientHeight);
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
        c: 0
      });
    }
  }

  render() {
    return (
        <InfiniteScroll
            pageStart={0}
            loadMore={() => this.loadMore(this.props.postData)}
            hasMore={this.state.hasMore}
            isReverse
            threshold={50}
            loader={<Loader active inline="centered" />}
            useWindow={false}
        >
            {/* {this.state.messages.length > 0 ? this.state.messages.map((message) => (*/}
                {/* <Comment*/}
                    {/* id={message.authorId + '' + message.content}*/}
                    {/* key={uuidv4()}*/}
                    {/* name={message.author}*/}
                    {/* createdAt={message.createdAt}*/}
                    {/* content={message.content}*/}
                    {/* authorPhoto={message.authorPhoto}*/}
                    {/* currentUser={this.props.currentUser}*/}
                    {/* authorId={message.authorId}*/}
                    {/* attachment={message.attachment}*/}
                {/* />*/}
            {/* )) : <p className="noMoreMessages">No messages to display...</p>}*/}
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
  currentUser: PropTypes.object,
  user: PropTypes.object,
  postData: PropTypes.object
};
const mapStateToProps = (state) => ({
  currentUser: state.userReducer,
  postData: state.modalReducer.postData
});
export default connect(mapStateToProps, null)(ModalMessages);
