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
    if (this.state.active) {
      return (
          <div className="minichatCard">
            <Header active
                    toggleOpen={() => this.toggleOpen()}/>
            <MessageBox />
            <TextBox />
          </div>
      );
    }
    return(
        <div className="minichatCard">
            <Header toggleOpen={() => this.toggleOpen()}/>
        </div>
    );
  }
}

MinichatCard.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object
};


export default MinichatCard;
