import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Login from './Auth_Login';
import Register from './Auth_Registration';
import Community from '../App/App_Community';
import firebaseApp from '../../firebase';
import WalnutHomeContainer from '../App/App_Walnut_Home_Container';
import getUser from '../../thunks/app_thunks/getAppThunk';

export const history = createBrowserHistory();

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  componentDidMount() {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user && !user.emailVerified) {
        const timer = setInterval(() => {
          user.reload();
          if (user.emailVerified) {
            this.props.onVerified();
            history.replace('/walnuthome');
            clearInterval(timer);
          }
        }, 1000);
      }
      if (user) {
        console.log('inside');
        this.props.getUser();
      }
      // history.replace('/walnuthome');
      // if (!user) {
      //   // this.context.history.push('/walnuthome');
      //   history.replace('/login');
      //   // history.push('/walnuthome');
      // } else {
      //   if (user.emailVerified) {
      //     console.log('first');
      //     this.props.getUser();
      //     const isUserInCommunity = localStorage.getItem('isUserInCommunity');
      //     if (this.props.isCreated && !isUserInCommunity) {
      //       console.log('second');
      //       // TODO: this is the redirect that is racing
      //       // TODO: not to do with racing but the middleware, we need to make sure there is a server req
      //       // TODO: otherwise req.user never gets hit
      //       history.replace('/walnuthome');
      //     } else {
      //       if (sessionStorage.getItem(('url'))) {
      //         console.log('session third');
      //         console.log('url', sessionStorage.getItem('url'));
      //         history.replace(sessionStorage.getItem('url'));
      //       } else {
      //         console.log('no session fourth');
      //         history.replace('/walnuthome');
      //       }
      //     }
      //   }
      // }
    });
  }


  render() {
    return (
      <Router path="/" history={history}>
        <Switch>
          <Route path="/walnuthome" component={WalnutHomeContainer} />
          {/* <Route path="/community" render={() => (<Community history={history} />)} /> */}
          <Route path="/community/:name" component={Community} />
          <Route path="/login" component={Login} />
          <Route path="/:catch" render={(props) => <p>404 Page Not Found</p>} />
        </Switch>
      </Router>
    );
  }
}


Auth.propTypes = {
  getUser: PropTypes.func,
  isCreated: PropTypes.bool,
  isVerified: PropTypes.bool,
  onVerified: PropTypes.func
};

const mapStateToProps = (state) => ({
  isCreated: state.userReducer.isCreated,
  isVerified: state.userReducer.isVerified
});

const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(getUser()),
  onVerified: () => dispatch({type: 'IS_VERIFIED'})
});


export default connect(mapStateToProps, mapDispatchToProps)(Auth);
