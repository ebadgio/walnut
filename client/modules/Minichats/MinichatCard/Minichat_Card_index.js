import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebaseApp from '../../../firebase';
import Header from './Minichat_Card_Header';
import MessageBox from './Minichat_Card_Messages';
import TextBox from './Minichat_Card_Textbox';

class MinichatCard extends React.Component {
  constructor() {
    super();
    this.state = {
      active: true
    };
  }

  componentDidMount() {
    console.log('minichat mounted', this.props);
  }

  toggleOpen() {
    this.setState({active: !this.state.active});
  }

  render() {
    return (
      <div className="minichatCard">
        <Header active={this.state.active}
                postData={this.props.postData}
                toggleOpen={() => this.toggleOpen()}
                closeChat={this.props.closeChat}/>
        <MessageBox active={this.state.active}
                    postData={this.props.postData}
                    currentUser={this.props.currentUser}/>
        <TextBox active={this.state.active}
                 postData={this.props.postData}
                 currentUser={this.props.currentUser} />
      </div>
  );
  }
}

MinichatCard.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object,
  closeChat: PropTypes.func
};


export default MinichatCard;
