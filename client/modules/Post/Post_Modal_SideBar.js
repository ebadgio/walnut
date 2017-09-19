import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';
import SideBarConversationCard from './Post_Modal_SideBar_PostCards';
import { Divider } from 'semantic-ui-react';

class ModalSideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
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
                            <SideBarConversationCard
                                data={conv}
                                current={conv.postId === this.props.postData.postId}
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
  postData: PropTypes.object
};

const mapStateToProps = (state) => ({
  myConversations: state.conversationReducer.convos,
  currentCommunity: state.conversationReducer.current,
  currentUser: state.userReducer,
  postData: state.modalReducer.postData,
  open: state.modalReducer.open
});

const mapDispatchToProps = (dispatch) => ({
  addIds: (iDs) => dispatch({type: 'ADD_IDS', iDs: iDs})
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalSideBar);
