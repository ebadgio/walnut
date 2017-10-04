import React from 'react';
import PropTypes from 'prop-types';
import './Quickchat.css';
import MessageBox from './Quickchat_Messages';
import TextBox from './Quickchat_TextBox';

// TODO: this should be connected to reducer
// First quickchat component that gets mounted

class QuickChatContainer extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return(
        <div className="quickchatChatBox">
            <div className="quickchatGrouping">
              <MessageBox />
              <TextBox />
            </div>
        </div>
    );
  }
}

export default QuickChatContainer;


