import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RegistrationContainer from './Auth_Registration.js';
import { Button, Step, Input, Form, Modal, Message, Icon } from 'semantic-ui-react';
import facebookLoginThunk from '../../thunks/auth_thunks/facebookLoginThunk';
import googleLoginThunk from '../../thunks/auth_thunks/googleLoginThunk';
import signInThunk from '../../thunks/auth_thunks/signInThunk';
import firebase from 'firebase';
import verificationThunk from '../../thunks/auth_thunks/verificationThunk';
import $ from 'jquery';
import './Auth.css';


class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      emailVal: '',
      passwordVal: '',
      vemail: '',
      vpassword: '',
      rEmail: '',
      open: false,
      vopen: false,
      isChanging: false,
      isSendingEmailForV: false,
      buttonBig: false
    };
  }


  componentDidMount() {
    $(document).keypress((e) => {
      if (e.which === 13) {
        e.preventDefault();
        this.regLogin(e);
      }
    });
  }

  handleEmailChange(e) {
    this.setState({ emailVal: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ passwordVal: e.target.value });
  }

  handleResetEmailChange(e) {
    this.setState({ rEmail: e.target.value });
  }
  fbLogin() {
    this.props.fbLogin();
  }

  googleLogin() {
    this.props.googleLogin();
  }

  regLogin() {
    console.log('first', this);
    if (this.state.emailVal && this.state.passwordVal) {
      console.log('second', this);
      this.props.signIn(this.state.emailVal, this.state.passwordVal, this.props.redirect);
    }
  }

  open() {
    this.setState({ open: true });
  }

  close() {
    this.setState({ open: false });
  }

  vopen() {
    this.setState({ vopen: true });
  }

  vclose() {
    this.setState({ vopen: false });
  }

  handleReset() {
    if (this.state.rEmail) {
      const self = this;
      firebase.auth().sendPasswordResetEmail(this.state.rEmail).then(() => {
        self.setState({ isChanging: true });
        setTimeout(() => {
          self.setState({ isChanging: false });
        }, 10000);
      }, (error) => {
        console.log(error);
      });
    }
  }

  handleVerification() {
    if (this.state.vemail && this.state.vpassword) {
      this.setState({ isSendingEmailForV: true });
      this.props.reVerify(this.state.vemail, this.state.vpassword);
    }
  }

  render() {
    return (
      <div className="loginPage">
        <div className="row" id="navBarLogin">
          <div className="walnutTitleLoginDiv">
            <h1 className="walnutTitleLogin">Walnut</h1>
          </div>
          <div className="loginForm">
            {this.props.loginDisplay === 3 && !this.props.isError ?
              <Message negative>
                <Message.Header>Please verify your account</Message.Header>
              </Message> :
              null
            }
            {this.props.isError && this.props.loginDisplay !== 3 ?
              <Message negative>
                <Message.Header>Incorrect login credentials</Message.Header>
              </Message> :
              null
            }
            <Form className="loginForm">
              <Form.Field className="inputLogin">
                {/* <label className="authLabels">Email</label>*/}
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  className="loginInputs"
                  onChange={(e) => this.handleEmailChange(e)}
                  value={this.state.emailVal} />
              </Form.Field>
              <Form.Field className="inputLoginPassword">
                {/* <label className="authLabels">Password</label>*/}
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="loginInputs"
                  onChange={(e) => this.handlePasswordChange(e)}
                  value={this.state.passwordVal} />
                <Button onClick={() => this.open()} onKeyPress={() => { console.log('enter'); }} className="forgotPassword" labelPosition="right" content="Forgot Password?" />
              </Form.Field>
              <div onClick={(e) => this.regLogin(e)} className="loginButton">Log In</div>
              <Modal size={'mini'} basic open={this.state.open} onClose={() => this.close()}>
                <Modal.Header>
                  Reset the password
                  </Modal.Header>
                <Modal.Content>
                  <Input label="Email" onChange={(e) => this.handleResetEmailChange(e)} />
                </Modal.Content>
                <Modal.Actions>
                  <Button className="authButtons" icon="mail forward" labelPosition="right" content="Verify" onClick={() => { this.handleReset(); this.close(); }} />
                </Modal.Actions>
              </Modal>
              <Modal size={'mini'} basic open={this.state.vopen} onClose={() => this.vclose()}>
                <Modal.Header>
                  Resend email verification
                  </Modal.Header>
                <Modal.Content>
                  <Form.Input label="Email" placeholder="Type Your Email" onChange={(e) => this.setState({ vemail: e.target.value })} />
                  <Form.Input label="Password" placeholder="Type Your Password" onChange={(e) => this.setState({ vpassword: e.target.value })} />
                </Modal.Content>
                <Modal.Actions>
                  <Button className="authButtons" positive icon="checkmark" labelPosition="right" content="Reset" onClick={() => { this.handleVerification(); this.vclose(); }} />
                </Modal.Actions>
              </Modal>
            </Form>
          </div>
        </div>
        <h2 className="newUser">New user?</h2>
        {this.props.loginDisplay === 1 ?
          <div
            onClick={() => this.props.openReg()}
            className="registerShowButton"
          >Sign Up</div> : null}
        {this.props.loginDisplay === 2 ? <RegistrationContainer /> : null}
        {this.props.loginDisplay === 3 ?
          <Message id="awaitingVerification" icon>
            <Icon name="circle notched" loading />
            <Message.Header>Please check your email</Message.Header>
            <p>In order to verify your account</p>
            <Button onClick={() => this.vopen()}>Re send Verification Email</Button>
          </Message>
          : null}
        {this.props.loginDisplay === 4 ?
          <Message id="awaitingVerification">
            <Message.Header>Your account is now verified</Message.Header>
            <p>You can now login</p>
          </Message>
          : null}
        <h2 className="introTextBlurb">Where communities grow</h2>
        {/* <img className="backgroundImageLogin" src="https://s3-us-west-1.amazonaws.com/walnut-test/1672187-poster-1280-geo-hacker-905x509.jpg" />*/}
        <img className="landingImageSmall" src="http://sbims.com/wp-content/uploads/2017/04/Association_Membership_Networking_Connections.jpg" />
        <Step.Group size="mini" className="loginSteps">
          <Step active icon="id badge" title="Sign Up" description="Start a new account with us" />

          <Step icon="universal access" title="Create" description="Get your community online!" />

          <Step icon="cogs" title="Engage" description="Increase community engagement" />
        </Step.Group>
      </div>
    );
  }
}


Login.propTypes = {
  fbLogin: PropTypes.func,
  googleLogin: PropTypes.func,
  signIn: PropTypes.func,
  redirect: PropTypes.func,
  isError: PropTypes.bool,
  isVerified: PropTypes.bool,
  reVerify: PropTypes.func,
  loginDisplay: PropTypes.number,
  openReg: PropTypes.func,
  verifiedEmail: PropTypes.string
};

const mapStateToProps = (state) => ({
  isError: state.userReducer.isError,
  isVerified: state.userReducer.isVerified,
  loginDisplay: state.loginReducer.loginDisplay,
  verifiedEmail: state.loginReducer.user
});

const mapDispatchToProps = (dispatch) => ({
  fbLogin: () => facebookLoginThunk(dispatch),
  googleLogin: () => googleLoginThunk(dispatch),
  signIn: (email, password, redirect) => signInThunk(email, password, redirect)(dispatch),
  reVerify: (email, password) => dispatch(verificationThunk(email, password)),
  openReg: () => dispatch({ type: 'REGISTER_OPEN' })
});


export default connect(mapStateToProps, mapDispatchToProps)(Login);
