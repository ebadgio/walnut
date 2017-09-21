import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import joinConversationThunk from '../../thunks/post_thunks/joinConversationThunk';
import getPostFollowersThunk from '../../thunks/post_thunks/getPostFollowers';
import './Post.css';
import { Icon, Button, Popup, Divider } from 'semantic-ui-react';
import firebaseApp from '../../firebase';
import NestedPostModal from './Nested_Post_Modal';
import _ from 'underscore';

class ModalHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      members: [],
      postData: {},
      membersCount: 0
    };
  }

  componentDidMount() {
    const user = firebaseApp.auth().currentUser;
    this.setState({user: user});
    setInterval(() => {
      // console.log('here', this.props.postData, this.state.postData);
      if (this.props.postData.postId !== this.state.postData.postId) {
        // console.log('they different in head');
        const membersRef = firebaseApp.database().ref('/members/' + this.props.postData.postId);
        membersRef.on('value', (snapshot) => {
          const peeps =  _.values(snapshot.val());
          const members = peeps.filter((peep) => typeof (peep) === 'object');
          this.setState({membersCount: members.length, members: members, postData: this.props.postData});
        });

        // Getting # followers of this post
        const followersRef = firebaseApp.database().ref('/followGroups/' + this.props.postData.postId);
        followersRef.on('value', (snapshot) => {
          if (snapshot.val()) {
            const followers = Object.keys(snapshot.val());
            this.props.getPostFollowers(followers);
          }
        });
      }
    }, 500);
  }



  joinConversation() {
    const updates = {};
    updates['/follows/' + this.state.user.uid + '/' + this.props.currentUser.currentCommunity._id + '/' + this.props.postData.postId] = true;
    updates['/followGroups/' + this.props.postData.postId + '/' + this.state.user.uid] = true;
    firebaseApp.database().ref().update(updates);
  }

  leaveConversation() {
    const updates = {};
    updates['/follows/' + this.state.user.uid + '/' + this.props.currentUser.currentCommunity._id + '/' + this.props.postData.postId] = null;
    updates['/followGroups/' + this.props.postData.postId + '/' + this.state.user.uid] = null;
    firebaseApp.database().ref().update(updates);
  }

  render() {
    return (
            <div className="postHeaderModal">
                <NestedPostModal postData={this.props.postData}
                    currentUser={this.props.currentUser} />
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
              <Popup
                  className="followersPopup"
                  trigger={<Icon.Group className="followIconGroup" size="big">
                    <Icon name="user" />
                    <Icon corner
                          inverted
                          className="feedIcon"
                          style={{left: '50%'}}
                          name="feed" />
                  </Icon.Group>}
                  content={<div><h3>Followers</h3><Divider inverted />{this.props.postFollowers.map((follower) => <div className="followerGroup">
                    <div className="imageWrapperOnline">
                        <img className="postUserImage" src={follower.avatar} />
                      </div>
                    <div className="onlineName">{follower.fullName}</div>
                  </div>)}</div>}
                  position="right center"
                  inverted
                  hoverable
                  size={'small'}
              />
              <Popup
                  className="membersPopup"
                  trigger={<div className="inModalUsers">
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
              <div className="closingButton">
                <Icon name="close" size="big" onClick={() => this.props.closeModal()}/>
              </div>
            </div>
        );
  }
}
ModalHeader.propTypes = {
  postData: PropTypes.object,
  currentUser: PropTypes.object,
  joinConversation: PropTypes.func,
  myConvoIds: PropTypes.array,
  user: PropTypes.object,
  members: PropTypes.array,
  membersCount: PropTypes.number,
  closeModal: PropTypes.func,
  postFollowers: PropTypes.array,
  getPostFollowers: PropTypes.func
};
const mapStateToProps = (state) => ({
  myConvoIds: state.conversationReducer.iDs,
  currentUser: state.userReducer,
  postData: state.modalReducer.postData,
  postFollowers: state.modalReducer.postFollowers
});
const mapDispatchToProps = (dispatch) => ({
  getPostFollowers: (followerIds) => dispatch(getPostFollowersThunk(followerIds)),
  joinConversation: (postId) => dispatch(joinConversationThunk(postId)),
  closeModal: () => dispatch({type: 'MAKE_CLOSED'})
});
export default connect(mapStateToProps, mapDispatchToProps)(ModalHeader);
