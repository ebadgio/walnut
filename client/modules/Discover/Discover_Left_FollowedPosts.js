import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConversationCard from './Discover_My_Conversations_Card';
import { Loader, Sidebar, Button, Icon, Segment  } from 'semantic-ui-react';
import './Discover.css';
import firebaseApp from '../../firebase';
import _ from 'underscore';
import uuidv4 from 'uuid/v4';
import getMyConvosThunk from '../../thunks/user_thunks/getMyConvosThunk';

class FollowedPostsContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      unreadsGroup: {},
      total: 0,
      visible: false
    };
        // this.sumUnreads = this.sumUnreads.bind(this);
  }


  componentWillMount() {
        // console.log('my conversation map', this.props.myConversations);
        // TODO: map each post to get their unreads in its own object
        // TODO: for loop through array and if they have unreads put it in its own array
        // TODO: .sort on unreads and then concat the two array and use that in the maps
        // TODO: eventually my convs must be sorted by last unread
        // pass down the unreds so only 1 read from firebase is done
        // start listen for typers like in post modal messages
        // const userId = firebaseApp.auth().currentUser.uid;
        // firebaseApp.database().ref('/unreads/' + userId + '/' + this.props.postData.postId).on('value', snapshotB => {
        //   const unreadCount = snapshotB.val();
        //   if (!isNaN(unreadCount)) {
        //     if (unreadCount > 0) {
        //       this.setState({ unread: unreadCount });
        //       console.log('unread set to true');
        //     }
        //   }
        // });
  }

  componentDidMount() {
    if (this.props.currentUser) {
      const followsRef = firebaseApp.database().ref('/follows/' + this.props.currentUser.firebaseId + '/' + this.props.currentCommunity);
      followsRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          const follows = _.pairs(snapshot.val());
                    // this will filter down to only those postIds which are mapped to true
          const myConvs = follows.filter((follow) => follow[1]).map((fol) => fol[0]);
          if (myConvs) {
            this.props.getConvos(myConvs);
            this.props.addIds(myConvs);
          }
        }
      });
    }
  }


  toggleVisibility() {
    this.setState({ visible: !this.state.visible });
  }

  handleSelect() {
    this.setState({ visible: false });
  }

    // sumUnreads(id, num) {
    //   const group = this.state.unreadsGroup;
    //   group[id] = num;
    //   const total = _.values(group).reduce((sum, val) => sum + val);
    //   this.setState({unreadsGroup: group, total: total});
    // }

  render() {
    return (
        <div className="followedPostsGroup">
            <Segment onClick={() => {this.toggleVisibility(); }} className="followedPostsSegment">
                <Icon name={this.state.visible ? 'chevron down' : 'chevron left'} className="leftChevronIcon"/>
                Followed Posts
            </Segment>
            {(this.props.myConversations && this.props.myConversations.length > 0 && this.state.visible) ?
                 <div className="leftSideBox">
                     {this.props.myConversations.map((conv) =>
                         <ConversationCard data={conv}
                                           key={uuidv4()}
                                           handleSelect={() => this.handleSelect()}
                                           user={this.props.currentUser}/>
                     )}
                 </div> : null}
        </div>
    );
  }
}

FollowedPostsContainer.propTypes = {
  myConversations: PropTypes.array,
  currentUser: PropTypes.object,
  currentCommunity: PropTypes.string,
  getConvos: PropTypes.func,
  addIds: PropTypes.func
};

const mapStateToProps = (state) => ({
  myConversations: state.conversationReducer.convos,
  currentCommunity: state.conversationReducer.current,
  currentUser: state.userReducer
});

const mapDispatchToProps = (dispatch) => ({
  getConvos: (convos) => getMyConvosThunk(convos)(dispatch),
  addIds: (iDs) => dispatch({type: 'ADD_IDS', iDs: iDs})
});

export default connect(mapStateToProps, mapDispatchToProps)(FollowedPostsContainer);



