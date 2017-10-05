import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebaseApp from '../../../firebase';


class MinichatTextBox extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return(
        <div className="minichatTextBox">
        </div>
    );
  }
}

MinichatTextBox.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object
};


export default MinichatTextBox;
