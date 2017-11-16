import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {history} from './Auth_index';


class Waiting extends React.Component {
  constructor() {
    super();
    this.state = {
      c: 0
    };
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.setState({c: (this.state.c === 6 ? 0 : this.state.c + 1)});
    }, 500);
  }

  render() {
    return(
        <div className="login_wrapper">
            <div className="login_paper">
                <div className="waiting_title">
                    Please verify your account to continue.
                    An email has been sent to <span style={{color: '#00BCD4'}}>{this.props.match.params.email}</span>
                </div>
                <div className="waiting_animation">
                    <div className="waiting_animation_circle" style={this.state.c === 0 ? {background: '#673AB7'} : {}}></div>
                    <div className="waiting_animation_circle" style={this.state.c === 1 ? {background: '#3F51B5'} : {}}></div>
                    <div className="waiting_animation_circle" style={this.state.c === 2 ? {background: '#2196F3'} : {}}></div>
                    <div className="waiting_animation_circle" style={this.state.c === 3 ? {background: '#FFC107'} : {}}></div>
                    <div className="waiting_animation_circle" style={this.state.c === 4 ? {background: '#FF9800'} : {}}></div>
                    <div className="waiting_animation_circle" style={this.state.c === 5 ? {background: '#FF5722'} : {}}></div>
                </div>
            </div>
        </div>
    );
  }
}

Waiting.propTypes = {
  email: PropTypes.string,
  match: PropTypes.object
};

export default Waiting;


