import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Conversations.css';
import firebaseApp from '../../firebase';
import SideBar from './Conversations_SideBar';
import ChatBox from './ConversationsChatBox/Conversations_ChatBox_index';
import getPostFollowersThunk from '../../thunks/post_thunks/getPostFollowers';

class Conversations extends React.Component {
  constructor() {
    super();
    this.state = {
      postData: {},
    };
  }


  componentDidMount() {
    const urls = this.props.location.pathname;
    sessionStorage.setItem('url', urls);
  }


  togglePostData(data) {
    const followersRef = firebaseApp.database().ref('/followGroups/' + data.postId);
    followersRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        const followers = Object.keys(snapshot.val());
        this.props.getPostFollowers(followers);
      }
    });
    this.props.toggleId(data.postId);
    this.setState({postData: data});
  }

  render() {
    if (this.props.isEmpty) {
      return(
        <div className="conversationsMainContainer">
          <span className="oopsNoConvo">You have not followed any conversations yet</span>
          <img src="https://s3-us-west-1.amazonaws.com/walnut-test/Sad-Emoji-PNG-Clipart.png" className="sadFace" />
          <span className="noConvoText">Follow a conversation for it to appear in your messenger</span>
        </div>
      );
    } else {
      return (
        <div className="conversationsMainContainer">
          <SideBar togglePostData={(data) => this.togglePostData(data)} />
          <ChatBox postData={this.state.postData} currentUser={this.props.currentUser} />
        </div>
      );
    }
  }
}

Conversations.propTypes = {
  currentUser: PropTypes.object,
  getPostFollowers: PropTypes.func,
  toggleId: PropTypes.func,
  location: PropTypes.object,
  isEmpty: PropTypes.bool
};

const mapStateToProps = (state) => ({
  currentUser: state.userReducer,
  isEmpty: state.conversationReducer.isEmpty
});

const mapDispatchToProps = (dispatch) => ({
  getPostFollowers: (followerIds) => dispatch(getPostFollowersThunk(followerIds)),
  toggleId: (id) => dispatch({type: 'TOGGLE_CURRENT_POST_ID', id: id})
});

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);
