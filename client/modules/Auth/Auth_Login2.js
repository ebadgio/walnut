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
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isError) {
      this.setState({isError: true});
    }
  }

  handleEmailChange(e) {
    this.setState({ emailVal: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ passwordVal: e.target.value });
  }

  signIn() {
    if (this.state.emailVal && this.state.passwordVal) {
      this.props.signIn(this.state.emailVal, this.state.passwordVal, history);
    } else if (!this.state.emailVal) {
      this.setState({noEmail: true});
    } else {
      this.setState({noPassword: true});
    }
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
                    {this.state.isError ? <div className="reg_warning">
                        Email and/or password do not match any of our records.
                        Please check your inputs and try again.
                    </div> : null}
                    {this.state.noEmail ? <div className="reg_warning">
                        Please fill out the email input field.
                    </div> : null }
                    {this.state.noPassword ? <div className="reg_warning">
                        Please fill out the password input field.
                    </div> : null }
                </div>
                <input className="login_inputs"
                       placeholder="Enter your email"
                       type="text"
                       onChange={(e) => this.handleEmailChange(e)}
                       style={this.state.noEmail ? {borderBottom: '1px solid #E53935'} : {}}
                       name="email" />
                <input className="login_inputs"
                       placeholder="Enter your password"
                       type="password"
                       style={this.state.noPassword ? {borderBottom: '1px solid #E53935'} : {}}
                       onChange={(e) => this.handlePasswordChange(e)}
                       name="password" />
                {/* <div className="password_forget">Forgot password?</div>*/}
                <div className="bottom_row">
                    <div className="new_user_block">
                        <span className="new_user_text">New user?</span>
                        <Link to="/signup" className="auth_link">Sign up</Link>
                    </div>
                    <div className="signin_button"
                         onClick={() => {
                           this.setState({isError: false, noEmail: false, noPassword: false});
                           this.signIn();
                         }}>Sign in</div>
                </div>
            </div>
        </div>
    );
  }
}

NewLogin.propTypes = {
  signIn: PropTypes.func,
  history: PropTypes.object,
  match: PropTypes.object,
  isError: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isError: state.userReducer.isError,
});

const mapDispatchToProps = (dispatch) => ({
  signIn: (email, password, his) => signInThunk(email, password, his)(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(NewLogin);
