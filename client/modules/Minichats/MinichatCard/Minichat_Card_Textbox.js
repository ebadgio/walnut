import React from 'react';
import PropTypes from 'prop-types';
import firebaseApp from '../../../firebase';
import { Form, TextArea, Icon } from 'semantic-ui-react';
import $ from 'jquery';
import _ from 'underscore';
import { Picker } from 'emoji-mart';
import FileModal from '../../Post/Post_Modal_File_Uploader.js';
import superagent from 'superagent';
import NotificationContainer from '../../Post/Notification';



class MinichatTextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      commentBody: '',
      typers: [],
      emojiIsOpen: false,
      file: '',
      active: props.active,
      notif: {},
      modalOpen: false
    };
  }

  componentDidMount() {
    const user = firebaseApp.auth().currentUser;
    this.setState({user: user});
    if (this.props.postData.postId) {
      this.startListen(this.props.postData, this.props.currentUser);
      const membersRef = firebaseApp.database().ref('/members/' + this.props.postData.postId);
      membersRef.on('value', (snapshot) => {
        const peeps = _.values(snapshot.val());
        const members = peeps.filter((peep) => typeof (peep) === 'object');
        this.setState({members: members});
      });
    }

    this.notificationFire(this.props.postData.postId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.setState({active: true});
    } else {
      this.setState({active: false});
    }
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
          console.log('other user');
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
          setTimeout(() => { this.setState({ notif: {} }); }, 4000);
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

  findEnter() {
    $('#minichatMessageInput').keypress((event) => {
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
    const elem = document.getElementById('minichatMessageInput');
    elem.value = '';
  }

  addEmoji(emoj) {
    this.setState({ emojiIsOpen: false, commentBody: this.state.commentBody + emoj.native});
        // this.handleClick(this.props.postData.postId, emoj.native);
  }

  openEmojiPicker() {
    this.setState({ emojiIsOpen: !this.state.emojiIsOpen });
  }

  // handleUploadModal(file) {
  //   this.setState({file: file, modalOpen: true});
  // }

  handleFileClose() {
    this.setState({file: '', modalOpen: false});
  }

  handleAwsUpload(body) {
    this.setState({commentBody: body, modalOpen: false});
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
    const myFile = $('#fileInputMiniChat').prop('files');
    this.setState({ file: myFile[0], modalOpen: true});
  }


  render() {
    return(
        <div className={this.state.active ? 'minichatTextBoxActive' : 'minichatTextBox'}>
        {Object.keys(this.state.notif).length > 0 ? <NotificationContainer notifClear={() => this.notifClear()} notif={this.state.notif} /> : null}
          <FileModal
              handleFileSubmit={(body) => this.handleAwsUpload(body)}
              handleFileClose={()=>this.handleFileClose()}
              fileName={this.state.file.name}
              modalOpen={this.state.modalOpen}/>
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
          <div className="conversationsInputWrapper">
            <Form className="conversationsTextBoxForm">
                      <TextArea
                          id="minichatMessageInput"
                          autoHeight
                          placeholder="What are your thoughts?..."
                          onChange={(e) => { this.handleChange(e); this.findEnter(); }}
                          rows={2}
                      />
            </Form>
            <div className="actionsTextBox">
              <Icon id="fileUploadMiniChat" onClick={() => $('#fileInputMiniChat').trigger('click')} className="attachFileIconModal" name="attach" size="large"/>
              <input id="fileInputMiniChat" type="file" onChange={() => this.upload()} />
              <Icon onClick={() => this.openEmojiPicker()} size="large" name="smile" className="emojiPickerMiniChat" />
            </div>
          </div>
        </div>
    );
  }
}

MinichatTextBox.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object,
  active: PropTypes.bool
};


export default MinichatTextBox;
