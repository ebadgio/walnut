import React from 'react';
import { Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Community from './App_Community';
import WalnutHomeContainer from './App_Walnut_Home_Container';
import NewCommunity from './App_NewCommunityModal';
import getUser from '../../thunks/app_thunks/getAppThunk';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: false,
    };
  }


  componentWillMount() {
    // this.props.getUser();
  }


  componentDidMount() {
    setTimeout(() => {this.setState({form: true});}, 1000);
  }


  render() {
    return (
        <div>
          <Switch>
            <Route path="/walnuthome" component={WalnutHomeContainer}/>
            <Route path="/create/community" component={NewCommunity} />
            <Route path="/community" render={() => <Community history={history} />} />
          </Switch>
        </div>
    );
  }
}


App.propTypes = {
  getUser: PropTypes.func,
  setUser: PropTypes.func
};


const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(getUser())
});


export default connect(null, mapDispatchToProps)(App);
