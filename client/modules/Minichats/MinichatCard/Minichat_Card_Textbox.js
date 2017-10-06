import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebaseApp from '../../../firebase';



class MinichatTextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.active
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.setState({active: true});
    } else {
      this.setState({active: false});
    }
  }

  render() {
    return(
        <div className={this.state.active ? 'minichatTextBoxActive' : 'minichatTextBox'}>
        </div>
    );
  }
}

MinichatTextBox.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object,
  active: PropTypes.bool
};


export default MinichatTextBox;
