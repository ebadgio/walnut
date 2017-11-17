import React from 'react';
import {Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Conversations.css';
import ConversationCard from './Conversations_FollowedPostCard';
import firebaseApp from '../../firebase';
import _ from 'underscore';
import getMyConvosThunk from '../../thunks/user_thunks/getMyConvosThunk';

class ConversationsSideBar extends React.Component {
  constructor() {
    super();
    this.state = {
      called: false
    };
  }

  componentDidMount() {
    if (this.props.currentUser) {
      const followsRef = firebaseApp.database().ref('/follows/' +
          this.props.currentUser.firebaseId +
          '/' +
          this.props.currentUser.currentCommunity._id);
      followsRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          const follows = _.pairs(snapshot.val());
          // this will filter down to only those postIds which are mapped to true
          const myConvs = follows.filter((follow) => follow[1]).map((fol) => fol[0]);
          if (myConvs) {
            console.log('myConvs', myConvs);
            this.props.getConvos(myConvs);
            this.props.addIds(myConvs);
          }
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.topPost.postId && !this.state.called) {
      this.props.togglePostData(nextProps.topPost);
      this.setState({called: true});
    }
  }

  render() {
    return(
        <div className="conversationsSideBar">
            {(this.props.myConversations && this.props.myConversations.length > 0) ?
                <div>{this.props.myConversations.map((conv) =>
                        <ConversationCard data={conv}
                                          togglePostData={(data) => this.props.togglePostData(data)}
                                          key={conv.postId}
                                          handleSelect={() => this.handleSelect()}
                                          user={this.props.currentUser}/>
                )}</div> : null}
        </div>
    );
  }
}

ConversationsSideBar.propTypes = {
  myConversations: PropTypes.array,
  currentUser: PropTypes.object,
  currentCommunity: PropTypes.string,
  getConvos: PropTypes.func,
  addIds: PropTypes.func,
  togglePostData: PropTypes.func,
  topPost: PropTypes.object,
};

const mapStateToProps = (state) => ({
  myConversations: state.conversationReducer.convos,
  currentCommunity: state.conversationReducer.current,
  currentUser: state.userReducer,
  topPost: state.messengerReducer.firstPost
});

const mapDispatchToProps = (dispatch) => ({
  getConvos: (convos) => getMyConvosThunk(convos)(dispatch),
  addIds: (iDs) => dispatch({type: 'ADD_IDS', iDs: iDs})
});

export default connect(mapStateToProps, mapDispatchToProps)(ConversationsSideBar);
