import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebaseApp from '../../../firebase';
import $ from 'jquery';
import _ from 'underscore';
import InfiniteScroll from 'react-infinite-scroller';
import Comment from '../../Post/Post_Comment';
import { Popup, Loader, Icon } from 'semantic-ui-react';


class MinichatMessageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      messages: [],
      typers: [],
      hitBottom: false,
      active: props.active,
      c: 0
    };
  }

  componentDidMount() {
    const user = firebaseApp.auth().currentUser;
    if (this.props.postData.postId) {
      this.startListen(this.props.postData, user);
      this.watchForTypers(this.props.postData, user);
      window.addEventListener('beforeunload', (ev) => {
        ev.preventDefault();
        if (user) {
          const updates2 = {};
          updates2['/members/' + this.props.postData.postId + '/' + user.uid] = null;
          firebaseApp.database().ref().update(updates2);
          const updatesEx = {};
          updatesEx['/typers/' + this.props.postData.postId + '/' + user.uid] = null;
          firebaseApp.database().ref().update(updatesEx);
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.setState({active: true});
    } else {
      this.setState({active: false});
    }
  }

  componentWillUnmount() {
    const user = firebaseApp.auth().currentUser;
    this.handleClose(this.props.postData, user);
  }

  watchForTypers(postData, user) {
    const typersRef = firebaseApp.database().ref('/typers' + '/' + postData.postId);
    typersRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        const pairs = _.pairs(snapshot.val());
        const typers = pairs.filter((pair) => pair[1])
                    .map((typer) => typer[1])
                    .filter((obj) => obj.typerId !== user.uid);
        this.setState({ typers: typers });
      } else {
        this.setState({ typers: [] });
      }
    });
  }

  startListen(data, user) {
    const scrollable = document.querySelector('.minichatMessageBoxActive');

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
        let currentVal;
        const unreadsCountRef = firebaseApp.database().ref('/unreads/' + user.uid + '/' + data.postId);
        unreadsCountRef.transaction((currentValue) => {
          currentVal = currentValue;
          return 0;
        });

        const totalUnreadsRef = firebaseApp.database().ref('/totalUnreads/' + user.uid + '/' + this.props.currentUser.currentCommunity._id);
        totalUnreadsRef.transaction((currentValue2) => {
          if ((currentValue2 || 0) >= currentVal) {
            return currentValue2 - currentVal;
          }
          return currentValue2;
        });
      }
    });

    if (data.postId) {
      const messagesRef = firebaseApp.database().ref('/messages/' + data.postId).orderByKey().limitToLast(20);
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
  handleClose(postData, user) {
    console.log('succesful messsagebox toggle', postData);
    if (this.props.postData.postId) {
      if (user) {
        this.setState({
          hitBottom: false,
          messages: [],
          firstKey: null,
          firstId: null,
          c: 0
        });
        const updates = {};
        updates['/members/' + postData.postId + '/' + user.uid] = null;
        firebaseApp.database().ref().update(updates);

        const updatesEx = {};
        updatesEx['/typers/' + postData.postId + '/' + user.uid] = null;
        firebaseApp.database().ref().update(updatesEx);
      }
    }
  }

  render() {
    return(
            <div className={this.state.active ? 'minichatMessageBoxActive' : 'minichatMessageBox'}>
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
                  {this.state.messages.length > 0 ? this.state.messages.map((message) => (
                      <Comment
                          id={message.authorId + '' + message.content}
                          key={message.createdAt + '' + message.authorId + '' + message.content}
                          name={message.author}
                          createdAt={message.createdAt}
                          content={message.content}
                          authorPhoto={message.authorPhoto}
                          currentUser={this.props.currentUser}
                          authorId={message.authorId}
                          attachment={message.attachment}
                          mini
                      />
                  )) : null}
              </InfiniteScroll>
              <div className="conversationsTypingRow">
                  {this.state.typers.length > 0 ? this.state.typers.map((typer) =>
                      <div key={typer.typerId} className="typerGroup">
                        <Popup
                            trigger={<div className="messageAvatarOtherMini">
                              <img className="postUserImage" src={typer.typerPhoto} />
                            </div>}
                            content={typer.typer}
                            position="left center"
                            inverted
                        />
                        <Icon className="typingIcon" name="ellipsis horizontal" size="big" />
                      </div>
                  ) : null}
              </div>
            </div>
        );
  }
}

MinichatMessageBox.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object,
  active: PropTypes.bool
};


export default MinichatMessageBox;
