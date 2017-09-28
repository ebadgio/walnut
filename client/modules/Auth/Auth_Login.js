import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RegistrationContainer from './Auth_Registration.js';
import { Button, Step, Input, Form, Modal, Message } from 'semantic-ui-react';
import facebookLoginThunk from '../../thunks/auth_thunks/facebookLoginThunk';
import googleLoginThunk from '../../thunks/auth_thunks/googleLoginThunk';
import signInThunk from '../../thunks/auth_thunks/signInThunk';
import firebase from 'firebase';
import verificationThunk from '../../thunks/auth_thunks/verificationThunk';
import $ from 'jquery';
import './Auth.css';

// TODO: component login


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
      registerClose: true,
      buttonBig: false
    };
  }


  componentDidMount() {
    $(document).keypress((e) =>  {
      if (e.which === 13) {
        e.preventDefault();
        this.regLogin(e);
      }
    });
  }

  handleEmailChange(e) {
    this.setState({emailVal: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({passwordVal: e.target.value});
  }

  handleResetEmailChange(e) {
    this.setState({rEmail: e.target.value});
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
    this.setState({open: true });
  }

  close() {
    this.setState({open: false});
  }

  vopen() {
    this.setState({vopen: true });
  }

  vclose() {
    this.setState({vopen: false});
  }

  handleReset() {
    if (this.state.rEmail) {
      const self = this;
      firebase.auth().sendPasswordResetEmail(this.state.rEmail).then(() => {
        self.setState({isChanging: true});
        setTimeout(() => {
          self.setState({isChanging: false});
        }, 10000);
      }, (error) => {
        console.log(error);
      });
    }
  }

  handleVerification() {
    if (this.state.vemail && this.state.vpassword) {
      this.setState({isSendingEmailForV: true});
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
              {this.state.isChanging ?
                <Message
                  success
                  header="Email will be sent soon"
                  content="Please follow the email"
                /> :
                null
              }
              {this.state.isSendingEmailForV ?
                <Message
                  success
                  header="Email will be sent soon"
                  content="Please verify your account"
                /> :
                null
              }
              {this.props.isError ?
                <Message negative>
                  <Message.Header>Oops something went wrong</Message.Header>
                  <p>Check your email and password again</p>
                </Message> :
                null
              }
              {this.props.isVerified ?
                null :
                <Message negative>
                  <Message.Header>Oops something went wrong</Message.Header>
                  <p>Your account has not been verified yet</p>
                  <Button onClick={() => this.vopen()}>Send Verification Email</Button>
                </Message>
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
                  <Button onClick={() => this.open()} onKeyPress={() => {console.log('enter');}} className="forgotPassword" labelPosition="right" content="Forgot Password?" />
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
                    Reset the password
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
          {this.state.registerClose ?
              <div
                  onClick={() => this.setState({ registerClose: false })}
                  className="registerShowButton"
              >Sign Up</div> : null}
          {/* {this.state.registerClose ? null : <RegistrationContainer /> }
          <div className="introTextDiv">
            <h1 className="introTextTitle">walnut network</h1>
            <h2 className="introTextBlurb">a conversation tool for communities </h2>
            <p className="introText">join a community</p>
            <p className="introText">... or create one</p>
            <p className="introText">start a conversation</p>
            <p className="introText">tag it by topics for it to be discovered by others</p>
            <p className="introText">follow conversations to get notified and remain updated by the ones that matter to you</p>
            <p className="introText">it's like a forum centred around communities but its just on steroids!</p>
          </div> */}
            {this.state.registerClose ? null : <RegistrationContainer /> }
          <h2 className="introTextBlurb">Where communities grow</h2>
          {/* <img className="backgroundImageLogin" src="https://s3-us-west-1.amazonaws.com/walnut-test/1672187-poster-1280-geo-hacker-905x509.jpg" />*/}
          <img className="landingImageSmall" src="http://sbims.com/wp-content/uploads/2017/04/Association_Membership_Networking_Connections.jpg"/>
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
  reVerify: PropTypes.func
};

const mapStateToProps = (state) => ({
  isError: state.userReducer.isError,
  isVerified: state.userReducer.isVerified
});

const mapDispatchToProps = (dispatch) => ({
  fbLogin: () => facebookLoginThunk(dispatch),
  googleLogin: () => googleLoginThunk(dispatch),
  signIn: (email, password, redirect) => signInThunk(email, password, redirect)(dispatch),
  reVerify: (email, password) => dispatch(verificationThunk(email, password))
});


export default connect(mapStateToProps, mapDispatchToProps)(Login);
