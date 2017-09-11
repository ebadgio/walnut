
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, TextArea, Popup, Icon } from 'semantic-ui-react';
import firebaseApp from '../../firebase';
import $ from 'jquery';
import _ from 'underscore';
import uuidv4 from 'uuid/v4';
import { Picker } from 'emoji-mart';
import ReactUploadFile from 'react-upload-file';
import FileModal from './Post_Modal_File_Uploader.js';
import superagent from 'superagent';

class ModalTextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentBody: '',
      typers: [],
      emojiIsOpen: false,
      file: '',
      optionsForUploadModal: {
        baseUrl: 'xxx',
        multiple: false,
        accept: 'image/*',
        didChoose: (files) => {
          console.log('inside comment upload');
          this.handleUploadModal(files[0]);
        },
      }
    };
  }


  componentWillMount() {
    this.watchForTypers();
    this.startListen();
  }

  componentWillUnMount() {
    this.setState({
      prevBody: '',
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
              typer: this.props.user.displayName,
              typerId: this.props.user.uid,
              typerPhoto: this.props.currentUser.pictureURL
            };
            updaters['/typers/' + this.props.postData.postId + '/' + this.props.user.uid] = typeInfo;
            firebaseApp.database().ref().update(updaters);
          }
          this.setState({ prevBody: this.state.commentBody, did: 1 });
        } else {
          const updatesEx = {};
          updatesEx['/typers/' + this.props.postData.postId + '/' + this.props.user.uid] = null;
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
          .filter((obj) => obj.typerId !== this.props.user.uid);
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
    updates['/typers/' + this.props.postData.postId + '/' + this.props.user.uid] = null;
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
        author: this.props.user.displayName,
        authorId: this.props.user.uid,
        content: this.state.commentBody,
        createdAt: new Date(),
        authorPhoto: this.props.currentUser.pictureURL,
        attachment: attachment
      };
    } else {
      message = {
        author: this.props.user.displayName,
        authorId: this.props.user.uid,
        content: this.state.commentBody,
        createdAt: new Date(),
        authorPhoto: this.props.currentUser.pictureURL,
        attachment: ''
      };
    }

    let temp = {};
    firebaseApp.database().ref('/followGroups/' + this.props.postData.postId).once('value', snapshot => {
      console.log('these people are following the post', snapshot.val());
      const followers = Object.keys(snapshot.val());
      const memberIds = this.props.members.map(member => member.uid);
      followers.forEach(follower => {
        let unreadCount = firebaseApp.database().ref('/unreads/' + member.uid + '/' + this.props.postData.postId);
        console.log('got in here?', memberIds, follower, snapshot.val()[follower]);
        if (snapshot.val()[follower] && !memberIds.includes(follower)) {
          firebaseApp.database().ref('/unreads/' + follower + '/' + this.props.postData.postId).once('value', snapshotB => {
            let unreadCount = snapshotB.val();
            console.log('unreadCount', snapshotB.val());
            temp['/unreads/' + follower + '/' + this.props.postData.postId] = !isNaN(unreadCount) ? unreadCount + 1 : 1;
            firebaseApp.database().ref().update(temp);
          });
        }
      });
    });
    // notification stuff ends here
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
    console.log('this is the emoji', emoj.native);
    this.setState({ emojiIsOpen: false, commentBody: this.state.commentBody + emoj.native});
    // this.handleClick(this.props.postData.postId, emoj.native);
  }

  openEmojiPicker() {
    this.setState({ emojiIsOpen: !this.state.emojiIsOpen });
  }

  handleUploadModal(file) {
    console.log('iniside here');
    this.setState({file: file});
  }

  handleFileClose() {
    this.setState({file: ''});
  }

  handleAwsUpload(body) {
    this.setState({commentBody: body});
    console.log('file uploader text', body);
    superagent.post('/aws/upload/comment')
      .attach('attach', this.state.file)
      .end((err, res) => {
        if (err) {
          console.log(err);
          alert('failed uploaded!');
        }
        console.log('file upload response', res.body);
        this.handleClick(this.props.postData.postId, res.body.attachment);
        this.setState({file: ''});
      });
  }

  render() {
    return (
      <div className="textBoxDiv">
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
            set="apple"
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
                  placeholder="Give your two cents..."
                  value={this.state.commentBody}
                  onChange={(e) => { this.handleChange(e); this.findEnter(); }}
                  rows={2}
              />
          </Form>
          <div className="actionsTextBox">
            <ReactUploadFile
                className="fileUploadModal"
                chooseFileButton={<Icon className="attachFileIconModal" name="attach" size="large" />}
                options={this.state.optionsForUploadModal} />
              {/* {(this.state.file !== '') ?
              <input value={(this.state.newFileName !== null) ? this.state.newFileName : this.state.file.name}
                onChange={(e) => this.changeFileName(e.target.value)} />
              :
              null} */}
            <Icon onClick={() => this.openEmojiPicker()} size="big" name="smile" className="emojiPicker" />
          </div>
        </div>
      </div>
        );
  }
}

ModalTextBox.propTypes = {
  postData: PropTypes.object,
  currentUser: PropTypes.object,
  members: PropTypes.array,
  user: PropTypes.object
};
const mapStateToProps = (state) => ({
  currentUser: state.userReducer
});

export default connect(mapStateToProps, null)(ModalTextBox);

