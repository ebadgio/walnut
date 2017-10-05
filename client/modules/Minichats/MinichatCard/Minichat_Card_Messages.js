import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebaseApp from '../../../firebase';


class MinichatMessageBox extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return(
            <div className="minichatMessageBox">
            </div>
        );
  }
}

MinichatMessageBox.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object
};


export default MinichatMessageBox;
