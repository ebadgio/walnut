import React from 'react';
import NavBar from './NavBar';
import Home from '../components/Home';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Map from '../components/Map';
import CreateProfile from './CreateProfile';
import Directory from '../components/Directory';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <div>
          <NavBar />
          <Switch>
            {/* <Route path="/app" component={(!this.state.profileCreated) ? Home : CreateProfile }/> */}
            <Route path="/app/createprofile" component={CreateProfile}/>
            <Route path="/app/projects" component={Home}/>
            <Route path="/app/directory" component={Directory} />
            <Route path="/app/map" component={Map}/>
            <Route path="/app" component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}


App.propTypes = {
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);