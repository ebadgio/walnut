import React from 'react';
import PropTypes from 'prop-types';
import { connect} from 'react-redux';
import axios from 'axios';
import MediaAttachment from './Post_Media_Attachment.js';
import LinkPreview from './LinkPreview';
import './Post.css';
import Lightbox from 'react-images';
import {Divider, Icon, Button, Segment} from 'semantic-ui-react';
import dateStuff from '../../dateStuff';
import firebaseApp from '../../firebase';
import _ from 'underscore';
import getPostFollowersThunk from '../../thunks/post_thunks/getPostFollowers';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nested: this.props.nested,
      likeCount: this.props.postData.likes.length,
      isLiked: this.props.postData.likes.indexOf(this.props.currentUser._id) > 0,
      lightBoxData: '',
      pdfModalData: '',
      page: 1,
      pages: 100,
      urls: [],
      messageBody: '',
      messageBody1: '',
      messageBody2: '',
      newLink: '',
      urlName: '',
      members: [],
      count: 0,
      unreads: 0,
      numFollowers: 0,
      showDrawer: false,
      isFollowing: false,
      meta: {}
    };
    this.getUseDate = this.getUseDate.bind(this);
  }

  componentWillMount() {
    const urls = this.urlFinder(this.props.postData.content);
    if (urls.length === 0) {
      this.setState({ messageBody: this.props.postData.content });
      return false;
    }
    axios.post('/db/get/linkpreview', {
      url: urls[0]
    })
    .then((response) => {
      console.log('return meta fetch', response.data.meta);
      this.setState({ meta: response.data.meta });
      if (urls.length !== 0) {
        const idx = this.props.postData.content.indexOf(urls[0]);
        const newBody1 = this.props.postData.content.substr(0, idx);
        const newBody2 = this.props.postData.content.substr((idx + urls[0].length), this.props.postData.content.length);
        const newLink = urls[0];
        if (!response.data.meta.description || !response.data.meta.title || !response.data.meta.image) {
          this.setState({ messageBody1: newBody1, messageBody2: newBody2, newLink: newLink });
        } else {
          this.setState({ messageBody1: newBody1, messageBody2: newBody2, newLink: newLink, urlName: this.urlNamer(newLink) });
        }
      }
    })
    .catch((err) => {
      console.log('error in meta scrape', err);
    });
  }

  componentDidMount() {
    const user = firebaseApp.auth().currentUser;
    this.setState({ user: user, timeStamp: this.getUseDate(this.props.postData.createdAt)});
    const membersRef = firebaseApp.database().ref('/members/' + this.props.postData.postId);
    membersRef.on('value', (snapshot) => {
      const peeps =  _.values(snapshot.val());
      const members = peeps.filter((peep) => typeof (peep) === 'object');
      this.setState({membersCount: members.length, members: members});
    });
    const countRef = firebaseApp.database().ref('/counts/' + this.props.postData.postId + '/count');
    countRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({count: snapshot.val()});
      }
    });

    // Determining if this user follows this post
    const followsRef = firebaseApp.database().ref('/follows/' + user.uid + '/' + this.props.currentUser.currentCommunity._id + '/' +  this.props.postData.postId);
    followsRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({isFollowing: true});
      } else {
        this.setState({isFollowing: false});
      }
    });

    // Getting # followers of this post
    const followersRef = firebaseApp.database().ref('/followGroups/' + this.props.postData.postId);
    followersRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        const followers = Object.keys(snapshot.val());
        this.props.getPostFollowers(followers);
        this.setState({numFollowers: followers.length});
      }
    });


    // unreads stuff
    firebaseApp.database().ref('/unreads/' + user.uid + '/' + this.props.postData.postId).on('value', snapshotB => {
      const unreadCount =  snapshotB.val();
      console.log('unreads', unreadCount);
      if (!isNaN(unreadCount) && unreadCount !== null) {
        this.setState({unreads: unreadCount});
      }
    });
  }

  getUseDate(dateObj) {
    if (dateObj) {
      const now = new Date().toString().slice(4, 24).split(' ');
      const date = new Date(dateObj);
      const dateString = date.toString().slice(4, 24);
      const split = dateString.split(' ');
      const useMonth = dateStuff.months[split[0]];
      const useDay = dateStuff.days[split[1]];
      const timeArr = split[3].split(':');
      let time;
      let hour;
      let isPM;
      if (parseInt(timeArr[0], 10) > 12) {
        hour = parseInt(timeArr[0], 10) - 12;
        isPM = true;
      } else if (parseInt(timeArr[0], 10) === 12) {
        hour = 12;
        isPM = true;
      } else {
        if (parseInt(timeArr[0], 10) === 0) {
          hour = 12;
        } else {
          hour = parseInt(timeArr[0], 10);
        }
      }
      const min = timeArr[1];
      if (isPM) {
        time = hour + ':' + min + 'PM';
      } else {
        time = hour + ':' + min + 'AM';
      }
      if (now[2] !== split[2]) {
        return useMonth + ' ' + useDay + ', ' + split[2] + ' ' + time;
      }
      return useMonth + ' ' + useDay + ', ' + time;
    }
    return '-';
  }

  urlNamer(url) {
    const arr = url.split('/')[2].split('.');
    let name = '';
    if (arr.length === 2) {
      name = arr[0];
    } else {
      name = arr[1];
    }
    return name;
  }

  urlFinder(text) {
    const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    const urls = [];
    text.replace(urlRegex, (url, b, c) => {
      const url2 = (c === 'www.') ? 'http://' + url : url;
      urls.push(url2);
    });
    return urls;
  }

  handleClick() {
    this.setState({isOpen: !this.state.isOpen});
  }

  toggleLike() {
    this.props.newLike();
    if (this.state.isLiked) {
      this.setState({likeCount: this.state.likeCount - 1, isLiked: false});
    } else {
      this.setState({likeCount: this.state.likeCount + 1, isLiked: true});
    }
  }

  renderLightBox(data) {
    this.setState({lightBoxData: data});
  }

  closeLightbox() {
    this.setState({lightBoxData: ''});
  }

  renderPdfModal(data) {
    this.setState({pdfModalData: data});
  }

  joinConversation() {
    const updates = {};
    updates['/follows/' + this.state.user.uid + '/' + this.props.currentUser.currentCommunity._id + '/' + this.props.postData.postId] = true;
    updates['/followGroups/' + this.props.postData.postId + '/' + this.state.user.uid] = true;
    firebaseApp.database().ref().update(updates);
  }

  // Don't delete, will use it eventually
  leaveConversation() {
    const updates = {};
    updates['/follows/' + this.state.user.uid + '/' + this.props.currentUser.currentCommunity._id + '/' + this.props.postData.postId] = null;
    updates['/followGroups/' + this.props.postData.postId + '/' + this.state.user.uid] = null;
    firebaseApp.database().ref().update(updates);
  }

  closeModal() {
    this.setState({ pdfUrl: '', page: 1 });
  }

  handlePrevious() {
    if(this.state.page === 1) {
      this.setState({ page: this.state.pages });
    } else {
      this.setState({ page: this.state.page - 1 });
    }
  }

  handleNext() {
    if(this.state.page === this.state.pages) {
      this.setState({ page: 1 });
    } else {
      this.setState({ page: this.state.page + 1 });
    }
  }

  onDocumentComplete(pages) {
    this.setState({ page: 1, pages: pages });
  }

  onPageComplete(page) {
    this.setState({ page: page });
  }

  closePdfModal() {
    this.setState({pdfModalData: ''});
  }

  closeDownloadModal() {
    this.setState({downloadUrl: ''});
  }

  // changeUnreads() {
  //   // TODO: unreads to 0
  // }

  // toggleDrawer() {
  //   const before = this.state.showDrawer;
  //   this.setState({showDrawer: !this.state.showDrawer});

  //   // trying to stop it from making the page jump, it only works sometimes tho so i commented it out
  //   // if (!before) {
  //   //   this.getPlace();
  //   // }
  // }

  getPlace() {
    const elem = document.getElementById('commentDiv');
    elem.scrollIntoView({block: 'center'});
  }

  render() {
    return (
      <div className="postOuter">
        <Segment className={this.state.showDrawer ? 'postSegmentDrawerOpen' : 'postSegment'}>
          <div className="postContent">
            <div className="postUser" id="postUser">
              <div className="imageWrapperPost">
                  <img className="postUserImage" src={this.props.postData.pictureURL} />
              </div>
              <div className="postHeader">
                <h3 className="postHeaderUser">{this.props.postData.username}</h3>
                <p className="postTimeStamp">{this.state.timeStamp}</p>
              </div>
                {this.state.isFollowing ? <div className="isFollowingGroup">
                  <Icon name="checkmark" className="iconFollowing" size={'small'} />
                  <p className="followingText">Following</p>
                </div> : <div className="postFollowButton" onClick={() => this.joinConversation()}>
                  <Icon name="plus" className="followIcon" />
                  Follow
                </div>}
            </div>
            <div className="postDescription">
              <div className="postInnerContent">
                {this.state.messageBody ? this.state.messageBody :
                <div>{this.state.messageBody1} <a href={this.state.newLink}>{this.state.urlName ? this.state.urlName : this.state.newLink}</a> {this.state.messageBody2}</div>
                }
              </div>
            </div>

            {this.state.meta.description && this.state.meta.title && this.state.meta.image ? <LinkPreview meta={this.state.meta} url={this.state.newLink} /> : null}

            {(this.props.postData.attachment.name !== '') ?
            <MediaAttachment data={this.props.postData.attachment}
            renderLightBox={(data) => this.renderLightBox(data)}
            renderPdfModal={(data) => this.renderPdfModal(data)}/>
            : null}
            <Lightbox
              images={[{
                src: this.state.lightBoxData.url,
                caption: this.state.lightBoxData.name
              }]}
              isOpen={this.state.lightBoxData !== ''}
              onClose={() => this.closeLightbox()}
              />
          </div>
          <div className="statsGroup">
            <span className="activeNum">
              {this.state.membersCount > 0 ? this.state.membersCount + ' active' : null}
            </span>
            <span className="followNum">
                  {this.state.numFollowers}{this.state.numFollowers === 1 ? ' follower' : ' followers'}
            </span>
            <span className="commentNum">
                  {this.state.count}{' messages'}
            </span>
            {this.state.isFollowing ? <span className={this.state.unreads > 0 ? 'isUnread' : 'noUnread'}>
                  {this.state.unreads}{' unread'}
            </span> : null}
          </div>
          <Divider className="postDivider" fitted />
          <div className="postFootnote">
            <div className="tagContainer">
              {this.props.postData.tags.map((tag, index) => (
              <div key={index} className="tag">
                <text className="hashtag">#{' ' + tag.name}</text>
              </div>))}
            </div>
            <div></div>
            <div className="commentDiv" id="commentDiv">
              <div className="messagesGroup" onClick={() => this.props.addChat(this.props.postData)}>
                <Icon size="big" name="comments outline" className="commentIcon" />
                <p className="messageText">Chat</p>
              </div>
            </div>
          </div>
        </Segment>
        {/* {this.state.showDrawer ? <PostDrawer currentUser={this.props.currentUser}
                                             members={this.state.members}
                                             postData={this.props.postData}/> : null} */}
      </div>
    );
  }
}
Post.propTypes = {
  postData: PropTypes.object,
  newLike: PropTypes.func,
  currentUser: PropTypes.object,
  nested: PropTypes.bool,
  getPostFollowers: PropTypes.func,
  addChat: PropTypes.func
};

const mapDispatchToProps = (dispatch) => ({
  getPostFollowers: (followerIds) => dispatch(getPostFollowersThunk(followerIds)),
  addChat: (postData) => dispatch({type: 'ADD_CHAT', postData: postData})
});

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
