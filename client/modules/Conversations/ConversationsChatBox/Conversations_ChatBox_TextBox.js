import React from 'react';
import {Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../Conversations.css';
import { Form, TextArea, Popup, Icon } from 'semantic-ui-react';
import firebaseApp from '../../../firebase';
import $ from 'jquery';
import _ from 'underscore';
import FileModal from '../../Post/Post_Modal_File_Uploader.js';
import superagent from 'superagent';
import NotificationContainer from '../../Post/Notification';

class ConversationsTextBox extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      commentBody: '',
      typers: [],
      emojiIsOpen: false,
      file: '',
      notif: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    const user = firebaseApp.auth().currentUser;
    this.setState({user: user});
    if (nextProps.postData.postId) {
      this.startListen(nextProps.postData, nextProps.currentUser);
      const membersRef = firebaseApp.database().ref('/members/' + nextProps.postData.postId);
      membersRef.on('value', (snapshot) => {
        const peeps = _.values(snapshot.val());
        const members = peeps.filter((peep) => typeof (peep) === 'object');
        this.setState({members: members});
      });
    }
    this.notificationFire(nextProps.postData.postId);
  }

  startListen(postData, currentUser) {
    setInterval(() => {
      if (this.state.commentBody) {
        if (this.state.commentBody !== this.state.prevBody) {
          if (this.state.did === 0) {
            const updaters = {};
            const typeInfo = {
              typer: this.state.user.displayName,
              typerId: this.state.user.uid,
              typerPhoto: currentUser.pictureURL
            };
            updaters['/typers/' + postData.postId + '/' + this.state.user.uid] = typeInfo;
            firebaseApp.database().ref().update(updaters);
          }
          this.setState({ prevBody: this.state.commentBody, did: 1 });
        } else {
          const updatesEx = {};
          updatesEx['/typers/' + postData.postId + '/' + this.state.user.uid] = null;
          firebaseApp.database().ref().update(updatesEx);
          this.setState({ did: 0 });
        }
      }
    }, 300);
  }

  // this listens for notification banners
  notificationFire(postId) {
    const user = firebaseApp.auth().currentUser;
    const messagesRef = firebaseApp.database().ref('/messages/' + postId).orderByKey().limitToLast(20);
    messagesRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        const send = _.values(snapshot.val());
        const newMessage = send[send.length - 1];
        if (newMessage.authorId !== user.uid) {
          this.setState({
            notif: {
              title: newMessage.author,
              options: {
                body: newMessage.content,
                lang: 'en',
                dir: 'ltr',
                icon: 'https://s3.amazonaws.com/walnut-logo/logo.svg'
              },
              ignore: false
            }
          });
          setTimeout(()=> {this.setState({ notif: {} });}, 4000);
        }
      }
    });
  }

  // clears notif object
  notifClear() {
    this.setState({ notif: {} });
  }

  handleChange(e) {
    this.setState({ commentBody: e.target.value });
  }

  findEnter(event) {
    if (event.key === 'Enter') {
      if (this.state.commentBody.length > 0) {
        this.handleClick(this.props.postData.postId, null);
      }
    }
  }

  handleClick(id, attachment) {
    if (this.state.commentBody) {
      const updates = {};
      let message;
      updates['/typers/' + this.props.postData.postId + '/' + this.state.user.uid] = null;
      firebaseApp.database().ref().update(updates);
        // const commentBody = this.state.commentBody;
        // const split = commentBody.split(' ');
        // split.forEach((word, idx) => {
        //   if (word.length > 31) {
        //     const firstHalf = word.slice(0, 32);
        //     const secondHalf = word.slice(32);
        //     split[idx] = firstHalf + '\n' + secondHalf;
        //   }
        // });
        // const useBody = split.join(' ');
      if (attachment) {
        message = {
          author: this.state.user.displayName,
          authorId: this.state.user.uid,
          content: this.state.commentBody,
          createdAt: new Date(),
          authorPhoto: this.props.currentUser.pictureURL,
          attachment: attachment
        };
      } else {
        message = {
          author: this.state.user.displayName,
          authorId: this.state.user.uid,
          content: this.state.commentBody,
          createdAt: new Date(),
          authorPhoto: this.props.currentUser.pictureURL,
          attachment: ''
        };
      }

      // Last message stuff
      const updateLast = {};
      updateLast['/lastMessage/' + this.props.postData.postId] = {
        author: this.state.user.displayName,
        content: this.state.commentBody
      };
      firebaseApp.database().ref().update(updateLast);

      // unread messages set up
      firebaseApp.database().ref('/followGroups/' + this.props.postData.postId).once('value', snapshot => {
        const followers = Object.keys(snapshot.val());
        const memberIds = this.state.members.map(member => member.uid);
        followers.filter(fol => (memberIds.indexOf(fol) === -1 && fol !== this.state.user.uid)).forEach(follower => {
          const unreadsCountRef = firebaseApp.database().ref('/unreads/' + follower + '/' + this.props.postData.postId);
          unreadsCountRef.transaction((currentValue) => {
            return (currentValue || 0) + 1;
          });

          const totalUnreadsRef = firebaseApp.database().ref('/totalUnreads/' + follower + '/' + this.props.currentUser.currentCommunity._id);
          totalUnreadsRef.transaction((currentValue) => {
            return (currentValue || 0) + 1;
          });
        });
      });
      // unread stuff ends here

      this.setState({commentBody: '', prevBody: ''});
      const update = {};
      const newMessageKey = firebaseApp.database().ref().child('messages').push().key;
      update['/messages/' + id + '/' + newMessageKey] = message;
      firebaseApp.database().ref().update(update);
      const messagesCountRef = firebaseApp.database().ref('/counts/' + this.props.postData.postId + '/count');
      messagesCountRef.transaction((currentValue) => {
        return (currentValue || 0) + 1;
      });
      const elem = document.getElementById('conversationsMessageInput');
      elem.value = '';
    }
  }

  // addEmoji(emoj) {
  //   console.log('emoji', emoj.native);
  //   this.setState({ emojiIsOpen: false, commentBody: this.state.commentBody + emoj.native});
  //       // this.handleClick(this.props.postData.postId, emoj.native);
  // }

  // openEmojiPicker() {
  //   this.setState({ emojiIsOpen: !this.state.emojiIsOpen });

  //   $(document).bind('click', (e) => {
  //     if (!$(e.target).is('#emojiPicker')) {
  //       this.setState({ emojiIsOpen: false });
  //     }
  //   });
  // }

  handleUploadModal(file) {
    this.setState({file: file});
  }

  handleFileClose() {
    this.setState({file: ''});
  }

  handleAwsUpload(body) {
    this.setState({commentBody: body});
    superagent.post('/aws/upload/comment')
            .attach('attach', this.state.file)
            .end((err, res) => {
              if (err) {
                console.log(err);
                alert('failed uploaded!');
              }
              this.handleClick(this.props.postData.postId, res.body.attachment);
              this.setState({file: ''});
            });
  }

  upload(e) {
    const myFile = e.target.files;
    this.setState({ file: myFile[0]});
  }

  render() {
    return(
        <div className="conversationsTextBox">
          {Object.keys(this.state.notif).length > 0 ? <NotificationContainer notifClear={() => this.notifClear()} notif={this.state.notif} /> : null}
            <FileModal
                handleFileSubmit={(body) => this.handleAwsUpload(body)}
                handleFileClose={()=>this.handleFileClose()}
                fileName={this.state.file.name} />
            {/* {this.state.emojiIsOpen ?
                <div className="emojiDiv">
                    <Picker set="emojione"
                            id="emojiPicker"
                            onClick={(emoj) => console.log('inside here')}
                            title="Pick your emoji…" emoji="point_up"
                            className="emojiContainer"
                            emojiSize={24}
                            perLine={9}
                            skin={1}
                            style={{
                              width: '299px',
                              height: '190px',
                              overflowY: 'scroll',
                              backgroundColor: '#3a3a3a',
                              padding: '4px',
                              borderRadius: '6px'
                            }}
                            autoFocus={false} />
                </div>
                : null} */}
            <div className="conversationsInputWrapper">
                <Form className="conversationsTextBoxForm">
                      <TextArea
                          id="conversationsMessageInput"
                          autoHeight
                          placeholder="What are your thoughts?..."
                          onKeyPress={(e) => this.findEnter(e)}
                          value={this.state.commentBody}
                          onChange={(e) => { this.handleChange(e);}}
                          rows={2}
                      />
                </Form>
                <div className="actionsTextBox">
                    <Icon id="fileUploadConversation" onClick={() => this.fileInputConversation.click()} className="attachFileIconModal" name="attach" size="large"/>
                    <input ref={(input) => { this.fileInputConversation = input;}}  id="fileInputConversation" type="file" onChange={(e) => this.upload(e)} />
                    {/* <Icon onClick={() => this.openEmojiPicker()} size="large" name="smile" className="emojiPicker" /> */}
                </div>
            </div>
        </div>
    );
  }
}

ConversationsTextBox.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object,
};

export default ConversationsTextBox;
