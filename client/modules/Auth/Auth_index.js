import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NewLogin from './Auth_Login2';
import NewRegister from './Auth_Registration2';
import Community from '../App/App_Community';
import firebaseApp from '../../firebase';
import WalnutHomeContainer from '../App/App_Walnut_Home_Container';
import getUser from '../../thunks/app_thunks/getAppThunk';
import NewLanding from './Auth_Landing2';
import WalnutLoader from '../App/App_WalnutLoader';

export const history = createBrowserHistory();

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
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
        this.props.getUser();
        const url = window.location.href.split('/');
        if (url.length === 4 && url[url.length - 1] === '') {
          const com = localStorage.getItem('community');
          if (com) {
            history.replace('/community/' + com.split(' ').join('') + '/discover');
          } else {
            history.replace('/walnuthome');
          }
        }
        this.setState({loading: false});
      } else {
        this.setState({loading: false});
        const split = window.location.href.split('/');
        const end = split[split.length - 1];
        if (end === 'login') {
          history.replace('/login');
        } else if (end === 'signup') {
          history.replace('/signup');
        } else {
          history.replace('/');
        }
      }
    });
  }


  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={this.state.loading ? WalnutLoader : NewLanding} />
          <Route path="/walnuthome" component={WalnutHomeContainer} />
          <Route path="/community/:name" component={Community} />
          <Route path="/login" component={NewLogin} />
          <Route path="/signup" component={NewRegister} />
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
  onVerified: PropTypes.func,
  currentUser: PropTypes.object,
  match: PropTypes.object
};

const mapStateToProps = (state) => ({
  currentUser: state.userReducer,
  isCreated: state.userReducer.isCreated,
  isVerified: state.userReducer.isVerified
});

const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(getUser()),
  onVerified: () => dispatch({type: 'IS_VERIFIED'})
});


export default connect(mapStateToProps, mapDispatchToProps)(Auth);
