import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import joinConversationThunk from '../../thunks/post_thunks/joinConversationThunk';
import './Post.css';
import { Icon, Button, Popup } from 'semantic-ui-react';
import firebaseApp from '../../firebase';
import NestedPostModal from './Nested_Post_Modal';

class ModalHeader extends React.Component {

  joinConversation() {
    console.log('inside here! firebase connection');
    const updates = {};
    updates['/follows/' + this.props.user.uid + '/' + this.props.currentUser.currentCommunity._id + '/' + this.props.postData.postId] = true;
    updates['/followGroups/' + this.props.postData.postId + '/' + this.props.user.uid] = true;
    console.log('updates', updates);
    firebaseApp.database().ref().update(updates);
  }

  leaveConversation() {
    const updates = {};
    updates['/follows/' + this.props.user.uid + '/' + this.props.currentUser.currentCommunity._id + '/' + this.props.postData.postId] = false;
    updates['/followGroups/' + this.props.postData.postId + '/' + this.props.user.uid] = false;
    firebaseApp.database().ref().update(updates);
  }

  render() {
    return (
            <div className="postHeaderModal">
                <NestedPostModal postData={this.props.postData}
                    currentUser={this.props.currentUser} />
                <Popup
                    className="membersPopup"
                    trigger={<div className="inModalUsers">
                        <span className="userNum">{this.props.membersCount > 0 ? this.props.membersCount : ''}</span>
                        <Icon size="big" name="users" className="users" color="grey" />
                    </div>}
                    content={<div>{this.props.members.map((member) => <div className="imageWrapper messageAvatarOther popupAvatar">
                        <img className="postUserImage" src={member.avatar} />
                    </div>)}</div>}
                    position="right center"
                    inverted
                    hoverable
                    size={'small'}
                />
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
  membersCount: PropTypes.number
};
const mapStateToProps = (state) => ({
  myConvoIds: state.conversationReducer.iDs,
  currentUser: state.userReducer
});
const mapDispatchToProps = (dispatch) => ({
  joinConversation: (postId) => dispatch(joinConversationThunk(postId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ModalHeader);
