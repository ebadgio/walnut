
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, TextArea, Popup, Icon } from 'semantic-ui-react';
import firebaseApp from '../../../firebase';
import $ from 'jquery';
import _ from 'underscore';
import uuidv4 from 'uuid/v4';
import { Picker } from 'emoji-mart';
import FileModal from '../Post_Modal_File_Uploader.js';
import superagent from 'superagent';
import NotificationContainer from '../Notification';


class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      commentBody: '',
      typers: [],
      emojiIsOpen: false,
      file: '',
    };
  }


  componentDidMount() {
    const user = firebaseApp.auth().currentUser;
    this.setState({user: user});
    this.watchForTypers();
    this.startListen();
  }

  componentWillUnMount() {
    this.setState({
      prevBody: '',
      emojiIsOpen: false,
      did: 0
    });
  }

  startListen() {
    setInterval(() => {
      if (this.state.commentBody) {
        if (this.state.commentBody !== this.state.prevBody) {
          if (this.state.did === 0) {
            const updaters = {};
            const typeInfo = {
              typer: this.state.user.displayName,
              typerId: this.state.user.uid,
              typerPhoto: this.props.currentUser.pictureURL
            };
            updaters['/typers/' + this.props.postData.postId + '/' + this.state.user.uid] = typeInfo;
            firebaseApp.database().ref().update(updaters);
          }
          this.setState({ prevBody: this.state.commentBody, did: 1 });
        } else {
          const updatesEx = {};
          updatesEx['/typers/' + this.props.postData.postId + '/' + this.state.user.uid] = null;
          firebaseApp.database().ref().update(updatesEx);
          this.setState({ did: 0 });
        }
      }
    }, 300);
  }


  watchForTypers() {
    const typersRef = firebaseApp.database().ref('/typers' + '/' + this.props.postData.postId);
    typersRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        const pairs = _.pairs(snapshot.val());
        const typers = pairs.filter((pair) => pair[1])
                    .map((typer) => typer[1])
                    .filter((obj) => obj.typerId !== this.state.user.uid);
        this.setState({ typers: typers });
      } else {
        this.setState({ typers: [] });
      }
    });
  }

  handleChange(e) {
    this.setState({ commentBody: e.target.value });
  }

  findEnter() {
    $('#messageInput').keypress((event) => {
      if (event.which === 13) {
        if (this.state.commentBody.length > 0) {
          this.handleClick(this.props.postData.postId, null);
          return false; // prevent duplicate submission
        }
      }
      return null;
    });
  }

  handleClick(id, attachment) {
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
    if(attachment) {
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

        // unread messages set up
    firebaseApp.database().ref('/followGroups/' + this.props.postData.postId).once('value', snapshot => {
      const followers = Object.keys(snapshot.val());
      console.log('followers', followers);
      const memberIds = this.props.members.map(member => member.uid);
      followers.filter(fol => (memberIds.indexOf(fol) === -1 && fol !== this.state.user.uid)).forEach(follower => {
        const unreadsCountRef = firebaseApp.database().ref('/unreads/' + follower + '/' + this.props.postData.postId );
        unreadsCountRef.transaction((currentValue) => {
          return (currentValue || 0) + 1;
        });
      });
    });
    // unread stuff ends here

    this.setState({ commentBody: '', prevBody: '' });
    const update = {};
    const newMessageKey = firebaseApp.database().ref().child('messages').push().key;
    update['/messages/' + id + '/' + newMessageKey] = message;
    firebaseApp.database().ref().update(update);
    const messagesCountRef = firebaseApp.database().ref('/counts/' + this.props.postData.postId + '/count');
    messagesCountRef.transaction((currentValue) => {
      return (currentValue || 0) + 1;
    });
    const elem = document.getElementById('messageInput');
    elem.value = '';
  }

  addEmoji(emoj) {
    this.setState({ emojiIsOpen: false, commentBody: this.state.commentBody + emoj.native});
        // this.handleClick(this.props.postData.postId, emoj.native);
  }

  openEmojiPicker() {
    this.setState({ emojiIsOpen: !this.state.emojiIsOpen });
  }

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

  upload() {
    const myFile = $('#fileInputConversation').prop('files');
    this.setState({ file: myFile[0]});
  }

  render() {
    return (
            <div className="textBoxDiv">
                <NotificationContainer postData={this.props.postData} />
                <FileModal
                    handleFileSubmit={(body) => this.handleAwsUpload(body)}
                    handleFileClose={()=>this.handleFileClose()}
                    fileName={this.state.file.name} />
                {this.state.emojiIsOpen ?
                    <div className="emojiDiv">
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
                                  backgroundColor: '#3a3a3a',
                                  padding: '4px',
                                  borderRadius: '6px'
                                }}
                                autoFocus={false} />
                    </div>
                    : null}
                <div className="typingRow">
                    {this.state.typers.map((typer) =>
                        <div key={uuidv4()} className="typerGroup">
                            <Popup
                                trigger={<div className="imageWrapper messageAvatarOther typingImage">
                                    <img className="postUserImage" src={typer.typerPhoto} />
                                </div>}
                                content={typer.typer}
                                position="left center"
                                inverted
                            />
                            <Icon className="typingIcon" name="ellipsis horizontal" size="big" />
                        </div>
                    )}
                </div>
                <div className="inputWrapper">
                    <Form className="textBoxForm">
                      <TextArea
                          id="messageInput"
                          autoHeight
                          placeholder="What are your thoughts?..."
                          value={this.state.commentBody}
                          onChange={(e) => { this.handleChange(e); this.findEnter(); }}
                          rows={2}
                      />
                    </Form>
                    <div className="actionsTextBox">
                        <Icon id="fileUploadConversation" onClick={() => $('#fileInputConversation').trigger('click')} className="attachFileIconModal" name="attach" size="large"/>
                        <input id="fileInputConversation" type="file" onChange={() => this.upload()} />
                        <Icon onClick={() => this.openEmojiPicker()} size="large" name="smile" className="emojiPicker" />
                    </div>
                </div>
            </div>
        );
  }
}

TextBox.propTypes = {
  postData: PropTypes.object,
  currentUser: PropTypes.object,
  user: PropTypes.object,
  members: PropTypes.array
};

export default TextBox;
