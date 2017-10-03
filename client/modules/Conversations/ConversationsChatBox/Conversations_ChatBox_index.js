import React from 'react';
import {Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../Conversations.css';
import MessageBox from './Conversations_ChatBox_Messages';
import TextBox from './Conversations_ChatBox_TextBox';
import StatsBox from './Conversations_ChatBox_Stats';

class ConversationsChatBox extends React.Component {
  constructor() {
    super();
    this.state = {
      members: []
    };
  }

  render() {
    return(
        <div className="conversationsChatBox">
            <div className="chatGrouping">
              <MessageBox currentUser={this.props.currentUser} postData={this.props.postData}/>
              <TextBox currentUser={this.props.currentUser} postData={this.props.postData}/>
            </div>
            <StatsBox currentUser={this.props.currentUser} postData={this.props.postData}/>
        </div>
    );
  }
}

ConversationsChatBox.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object
};

export default ConversationsChatBox;
