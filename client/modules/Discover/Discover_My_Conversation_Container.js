import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConversationCard from './Discover_My_Conversations_Card';
import { Loader, Sidebar, Button, Icon  } from 'semantic-ui-react';
import './Discover.css';
import firebaseApp from '../../firebase';
import _ from 'underscore';
import uuidv4 from 'uuid/v4';
import getMyConvosThunk from '../../thunks/user_thunks/getMyConvosThunk';

class FollowedPostsContainer extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }


  componentWillMount() {
    console.log('my conversation map', this.props.myConversations);
    // TODO: map each post to get their unreads in its own object
    // TODO: for loop through array and if they have unreads put it in its own array 
    // TODO: .sort on unreads and then concat the two array and use that in the maps
    // TODO: eventually my convs must be sorted by last unread
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

  onOpen() {
    if (this.props.currentUser) {
      const followsRef = firebaseApp.database().ref('/follows/' + this.props.currentUser.firebaseId + '/' + this.props.currentCommunity);
      followsRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          console.log('got snapshot', snapshot.val());
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


  render() {
    return (
       <Sidebar.Pushable className="followedPostsPushable">
         <Sidebar animation="overlay"
                  direction="right"
                  visible={this.state.visible}>
           <Button icon onClick={() => {this.toggleVisibility()}} className="minifyButton">
             <Icon name="chevron circle down"
                   size="large"
             />
           </Button>
           {(this.props.myConversations && this.props.myConversations.length > 0) ?
               <div className="followedPostsBox">
                   {this.props.myConversations.map((conv) =>
                       <ConversationCard data={conv}
                                         key={uuidv4()}
                                         user={this.props.currentUser}/>
                     )}
               </div> : <div className="followedPostsBox"></div>}
         </Sidebar>
         <Sidebar.Pusher>
           <div className="rightContainer">
             <Button onClick={() => {this.toggleVisibility(); this.onOpen();}} className="followedPostsButton">
               Followed Posts
             </Button>
           </div>
         </Sidebar.Pusher>
       </Sidebar.Pushable>
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


