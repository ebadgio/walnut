import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Step, Input, Form, Modal, Message, Icon } from 'semantic-ui-react';
import signInThunk from '../../thunks/auth_thunks/signInThunk';
import firebase from 'firebase';
import verificationThunk from '../../thunks/auth_thunks/verificationThunk';
import $ from 'jquery';
import './Login.css';
import {history} from './Auth_index';

class NewLogin extends React.Component {
  constructor() {
    super();
    this.state = {
      emailVal: '',
      passwordVal: '',
      badPassword: false,
      badEmail: false,
    };
  }

  handleEmailChange(e) {
    this.setState({ emailVal: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ passwordVal: e.target.value });
  }

  signIn() {
    this.props.signIn(this.state.emailVal, this.state.passwordVal, history);
  }


  render() {
    return (
        <div className="login_wrapper">
            <div className="login_paper">
                <div className="login_header">
                    <img src="https://s3.amazonaws.com/walnut-logo/logo.svg"
                         className="login_logo"/>
                </div>
                <div className="warning_container">
                </div>
                <input className="login_inputs"
                       placeholder="Enter your email"
                       type="text"
                       onChange={(e) => this.handleEmailChange(e)}
                       name="email" />
                <input className="login_inputs"
                       placeholder="Enter your password"
                       type="password"
                       onChange={(e) => this.handlePasswordChange(e)}
                       name="password" />
                {/* <div className="password_forget">Forgot password?</div>*/}
                <div className="bottom_row">
                    <div className="new_user_block">
                        <span className="new_user_text">New user?</span>
                        <Link to="/signup" className="auth_link">Sign up</Link>
                    </div>
                    <div className="signin_button"
                         onClick={() => this.signIn()}>Sign in</div>
                </div>
            </div>
        </div>
    );
  }
}

NewLogin.propTypes = {
  signIn: PropTypes.func,
  history: PropTypes.object
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  signIn: (email, password, his) => signInThunk(email, password, his)(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(NewLogin);
