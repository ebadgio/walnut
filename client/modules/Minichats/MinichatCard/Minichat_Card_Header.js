import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebaseApp from '../../../firebase';


class MinichatHeader extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return(
        <div className={this.props.active ? 'minichatHeaderActive' : 'minichatHeader'}
             onClick={() => this.props.toggleOpen()}>
        </div>
    );
  }
}

MinichatHeader.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object,
  toggleOpen: PropTypes.func,
  active: PropTypes.bool
};


export default MinichatHeader;
