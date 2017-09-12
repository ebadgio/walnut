import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import firebaseApp from '../../firebase';
import _ from 'underscore';
import uuidv4 from 'uuid/v4';
import getMyConvosThunk from '../../thunks/user_thunks/getMyConvosThunk';
import ConversationCard from '../Discover/Discover_My_Conversations_Card';
import { Divider } from 'semantic-ui-react';

class ModalSideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log('SIDEBAR MOUNTED', this.props);
    if (this.props.open) {
      if (this.props.currentUser) {
        const followsRef = firebaseApp.database().ref('/follows/' + this.props.currentUser.firebaseId + '/' + this.props.currentCommunity);
        followsRef.on('value', (snapshot) => {
          if (snapshot.val()) {
            console.log('got snapshot', snapshot.val());
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
  getConvos: (convos) => getMyConvosThunk(convos)(dispatch),
  addIds: (iDs) => dispatch({type: 'ADD_IDS', iDs: iDs})
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalSideBar);
