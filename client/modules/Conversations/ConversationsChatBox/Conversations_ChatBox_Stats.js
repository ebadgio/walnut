import React from 'react';
import {Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../Conversations.css';
import { Icon, Popup, Divider} from 'semantic-ui-react';
import firebaseApp from '../../../firebase';
import _ from 'underscore';
import NestedPostModal from '../../Post/Nested_Post_Modal';

class ConversationsStatsBox extends React.Component {
  constructor() {
    super();
    this.state = {
      members: []
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('stats receive', nextProps);
    const membersRef = firebaseApp.database().ref('/members/' + nextProps.postData.postId);
    membersRef.on('value', (snapshot) => {
      const peeps =  _.values(snapshot.val());
      const members = peeps.filter((peep) => typeof (peep) === 'object');
      this.setState({membersCount: members.length, members: members, postData: nextProps.postData});
    });
  }

  render() {
    return(
        <div className="conversationsStatsBox">
            <NestedPostModal postData={this.state.postData} currentUser={this.props.currentUser}/>
            <div className="followersBox">
                <div className="titleGroup">
                    <Icon name="feed" className="followersIcon"/>
                    <span className="statTitles">Followers</span>
                </div>
                {this.props.postFollowers.map((follower) => <div className="followerGroup">
                    <div className="imageWrapperOnline">
                        <img className="postUserImage" src={follower.avatar} />
                    </div>
                    <div className="onlineName">{follower.fullName}</div>
                </div>)}
            </div>
            <div className="activeUserBox">
                <div className="titleGroup">
                    <div className="onlineCircle"></div>
                    <span className="statTitles">Active</span>
                </div>
                {this.state.members.map((member) => <div className="followerGroup">
                    <div className="imageWrapperOnline">
                        <img className="postUserImage" src={member.avatar} />
                    </div>
                    <div className="onlineName">{member.name}</div>
                </div>)}
            </div>
        </div>
    );
  }
}

ConversationsStatsBox.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object,
  postFollowers: PropTypes.array
};

const mapStateToProps = (state) => ({
  postFollowers: state.messengerReducer.postFollowers
});

export default connect(mapStateToProps, null)(ConversationsStatsBox);
