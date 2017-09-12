import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import firebaseApp from '../../firebase';
import uuidv4 from 'uuid/v4';
import ConversationCard from '../Discover/Discover_My_Conversations_Card';
import { Divider } from 'semantic-ui-react';

class ModalSideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log('my conversation map', this.props.myConversations);
    const userId = firebaseApp.auth().currentUser.uid;
    const mappedConversations = this.props.myConversations.map((convo) => {
      firebaseApp.database().ref('/unreads/' + userId + '/' + convo.postId).on('value', snapshotB => {
        const unreadCount = snapshotB.val();
        console.log('unread count', unreadCount);
        if (!isNaN(unreadCount)) {
          console.log('inside a return object');
          if (unreadCount > 0) {
            return {
              ...convo,
              unreadCount: unreadCount
            };
          } else {
            return {
              ...convo,
              unreadCount: 0
            };
          }
        }
      });
    });
    console.log('mapped conversation with unread', mappedConversations);
    // TODO: map each post to get their unreads in its own object
    // TODO: for loop through array and if they have unreads put it in its own array
    // TODO: .sort on unreads and then concat the two array and use that in the maps
    // TODO: eventually my convs must be sorted by last unread
  }

  render() {
    return (
            <div>
                <div className="topActions">
                    <p className="SideBarHeader">Followed Posts</p>
                    <Divider className="SideBarHeaderDivider"/>
                </div>
                <div className="SideBarPosts">
                {(this.props.myConversations && this.props.myConversations.length > 0) ?
                        this.props.myConversations.map((conv) =>
                            <ConversationCard data={conv}
                                              key={uuidv4()}
                                              user={this.props.currentUser}/>
                        )
                    : null}
                </div>
            </div>
        );
  }
}
ModalSideBar.propTypes = {
  open: PropTypes.bool,
  currentUser: PropTypes.object,
  myConversations: PropTypes.array,
  currentCommunity: PropTypes.object,
  getConvos: PropTypes.func,
  addIds: PropTypes.func,
};

const mapStateToProps = (state) => ({
  myConversations: state.conversationReducer.convos,
  currentCommunity: state.conversationReducer.current,
  currentUser: state.userReducer,
  open: state.modalReducer.open
});

const mapDispatchToProps = (dispatch) => ({
  addIds: (iDs) => dispatch({type: 'ADD_IDS', iDs: iDs})
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalSideBar);
