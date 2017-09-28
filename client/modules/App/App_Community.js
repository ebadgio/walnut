// TODO navbar and router links
import React from 'react';
import {Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Discover from '../Discover/Discover_index';
import Directory from '../Directory/Directory_index';
import NavBar from './App_Nav_Temp';
import MapContainer from '../Map/Map_index';
import updateLocationThunk from '../../thunks/map_thunks/updateLocationThunk';
import EditProfile from '../Editprofile/EditProfile_index';
import WalnutLoader from './App_WalnutLoader';

class Community extends React.Component {

  componentDidMount() {
    localStorage.setItem('isUserInCommunity', true);
    // localStorage.setItem('url', '/community');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.handlePosition.bind(this), this.handleError.bind(this));
    }
  }

  handlePosition(position) {
    this.props.updateLocation([position.coords.longitude, position.coords.latitude]);
  }

  handleError() {
    this.props.updateLocation([]);
  }

  render() {
    if (this.props.isReady && this.props.currentUser.fullName) {
      return (
            <div className={this.props.showDimmer ? 'newPostDimmer' : null}>
                <NavBar/>
                <Switch>
                    <Route path="/community/:communityName/directory" component={Directory}/>
                    <Route path="/community/:communityName/map" component={MapContainer}/>
                    <Route path="/community/:communityName/discover" component={Discover}/>
                    <Route path="/community/:communityName/editProfile" component={EditProfile}/>
                </Switch>
            </div>
        );
    }
    return (
      <WalnutLoader community />
    );
  }
}


Community.propTypes = {
  isReady: PropTypes.bool,
  updateLocation: PropTypes.func,
  history: PropTypes.object,
  currentUser: PropTypes.object,
  showDimmer: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isReady: state.discoverReducer.isReady,
  currentUser: state.userReducer,
  showDimmer: state.dimmerReducer
});


const mapDispatchToProps = (dispatch) => ({
  updateLocation: (params) => dispatch(updateLocationThunk(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Community);
