import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import emailRegistrationThunk from '../../thunks/auth_thunks/emailRegistrationThunk';
import {history} from './Auth_index';

class NewRegister extends React.Component {
  constructor() {
    super();
    this.state = {
      fName: '',
      lName: '',
      email: '',
      password: '',
      repeat: '',
      failed: false,
      passwordFail: false,
      passwordShort: false,
      missingFields: false
    };
  }

  handleFnameChange(e) {
    this.setState({ fName: e.target.value });
  }

  handleLnameChange(e) {
    this.setState({ lName: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleRepeatChange(e) {
    this.setState({ repeat: e.target.value });
  }

  register(e) {
    e.preventDefault();
    if (this.state.password !== this.state.repeat) {
      this.setState({ passwordFail: true });
    } else if (this.state.password.length < 6) {
      this.setState({ passwordShort: true });
    } else if (this.state.fName && this.state.lName && this.state.email && this.state.password && this.state.repeat) {
      this.props.emailRegistration(this.state.fName, this.state.lName, this.state.email, this.state.password, history);
    } else {
      this.setState({missingFields: true});
    }
  }

  render() {
    return(
        <div className="login_wrapper">
          <div className="register_paper">
            <Link className="back_to_login" to="/login">
              <Icon name="reply" size="small" className="back_icon"/>
              Back to login
            </Link>
            <div className="login_header">
              <img src="https://s3.amazonaws.com/walnut-logo/logo.svg"
                   className="login_logo"/>
            </div>
              <div className="warning_container">
                {this.state.passwordShort ? <div className="reg_warning">
                  Password must be at least 6 characters.
                </div> : null}
                {this.state.passwordFail ? <div className="reg_warning">
                  Passwords do not match please reenter and try again.
                </div> : null}
                {this.state.missingFields ? <div className="reg_warning">
                  Not all fields are filled in. Please finish entering your info and try again.
                </div> : null}
              </div>
            <input className="login_inputs"
                   placeholder="Enter your first name"
                   type="text"
                   onChange={(e) => this.handleFnameChange(e)}
                   name="fname" />
            <input className="login_inputs"
                   placeholder="Enter your last name"
                   type="text"
                   onChange={(e) => this.handleLnameChange(e)}
                   name="lname" />
            <input className="login_inputs"
                   placeholder="Enter your email"
                   type="text"
                   onChange={(e) => this.handleEmailChange(e)}
                   name="email" />
            <input className="login_inputs"
                   placeholder="Enter your password"
                   type="password"
                   onChange={(e) => this.handlePasswordChange(e)}
                   style={this.state.passwordShort ? {borderBottom: '1px solid #E53935'} : {}}
                   name="password" />
            <input className="login_inputs"
                   placeholder="Confirm password"
                   type="password"
                   onChange={(e) => this.handleRepeatChange(e)}
                   style={this.state.passwordFail ? {borderBottom: '1px solid #E53935'} : {}}
                   name="confirm-password" />
            <div className="signup_button" onClick={(e) => {
              this.setState({passwordShort: false, passwordFail: false, missingFields: false});
              this.register(e);
            }}>
              Sign up
            </div>
          </div>
        </div>
    );
  }
}

NewRegister.propTypes = {
  emailRegistration: PropTypes.func,
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  emailRegistration: (firstname, lastname, email, password, hist) =>
      emailRegistrationThunk(firstname, lastname, email, password, hist)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NewRegister);
