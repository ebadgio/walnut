import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { Button, Form, Modal, Message, Icon} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import emailRegistrationThunk from '../../thunks/auth_thunks/emailRegistrationThunk';
import './Auth.css';


class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      fName: '',
      lName: '',
      email: '',
      password: '',
      repeat: '',
      failed: false
    };
  }

  handleFnameChange(e) {
    this.setState({fName: e.target.value});
  }

  handleLnameChange(e) {
    this.setState({lName: e.target.value});
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleRepeatChange(e) {
    this.setState({repeat: e.target.value});
  }

  register(e) {
    e.preventDefault();
    if (this.state.fName && this.state.lName && this.state.email && this.state.password) {
      this.props.emailRegistration(this.state.fName, this.state.lName, this.state.email, this.state.password);
    }
  }

  render() {
    return (
      <div className="registerPage">
        <div className="registerCard">
          <Link to="/login">Back to Login</Link>
          <h1>Register</h1>
            {!this.props.isVerified ?
                <Message icon>
                  <Icon name="circle notched" loading />
                  <Message.Content>
                    <Message.Header>Email will be sent soon </Message.Header>
                    Please verify your account
                  </Message.Content>
                </Message> :
                null
            }
          <Form>
            <Form.Field>
              <label className="authLabels" htmlFor="fname">First Name</label>
              <input
                type="text"
                name="fname"
                value={this.state.fName}
                onChange={(e) => this.handleFnameChange(e)} />
            </Form.Field>
            <Form.Field>
              <label className="authLabels" htmlFor="lname">Last Name</label>
              <input
                type="text"
                name="lname"
                value={this.state.lName}
                onChange={(e) => this.handleLnameChange(e)} />
            </Form.Field>
            <Form.Field>
              <label className="authLabels" htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                value={this.state.email}
                onChange={(e) => this.handleEmailChange(e)} />
            </Form.Field>
            <Form.Field>
              <label className="authLabels" htmlFor="password">Password</label>
              <input className="form-control"
                type="password"
                name="password"
                value={this.state.password}
                onChange={(e) => this.handlePasswordChange(e)} />
            </Form.Field>
            <Form.Field>
              <label className="authLabels" htmlFor="passwordRepeat">Confirm Password</label>
              <input
                type="password"
                name="passwordRepeat"
                value={this.state.repeat}
                onChange={(e) => this.handleRepeatChange(e)} />
            </Form.Field>
            <Button className="authButtons" onClick={(e) => { this.register(e); }}>Register</Button>
          </Form>
        </div>
      </div>
    );
  }
}


Register.propTypes = {
  emailRegistration: PropTypes.func,
  isVerified: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isVerified: state.userReducer.isVerified
});

const mapDispatchToProps = (dispatch) => ({
  emailRegistration: (firstname, lastname, email, password) => emailRegistrationThunk(firstname, lastname, email, password)(dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(Register);
