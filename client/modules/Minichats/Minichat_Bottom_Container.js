import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Minichats.css';
import firebaseApp from '../../firebase';
import getPostFollowersThunk from '../../thunks/post_thunks/getPostFollowers';

import MinichatCard from './MinichatCard/Minichat_Card_index';

class BottomContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      openChats: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({openChats: nextProps.openChats});
  }

  render() {
    return(
        <div className="minichatBottomBar">
            {this.state.openChats.reverse().map((chat) => <MinichatCard key={chat.postId}
                                                              closeChat={this.props.closeChat.bind(this)}
                                                              postData={chat}
                                                              currentUser={this.props.currentUser}/>)}
        </div>
    );
  }
}

BottomContainer.propTypes = {
  currentUser: PropTypes.object,
  openChats: PropTypes.array,
  closeChat: PropTypes.func
};

const mapStateToProps = (state) => ({
  currentUser: state.userReducer,
  openChats: state.minichatReducer.openChats
});

const mapDispatchToProps = (dispatch) => ({
  closeChat: (postData) => dispatch({type: 'REMOVE_CHAT', postData: postData})
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomContainer);
