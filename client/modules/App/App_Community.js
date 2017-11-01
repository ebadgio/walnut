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
import EditProfile from '../Profile/EditProfile_index';
import WalnutLoader from './App_WalnutLoader';
import LeftSideContainer from './App_Left_Side_Container';
import Conversations from '../Conversations/Conversations_Index';
import firebaseApp from '../../firebase';

class Community extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log('MATCH', props.match);
  }

  componentDidMount() {
    localStorage.setItem('isUserInCommunity', true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.handlePosition.bind(this), this.handleError.bind(this));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser.fullName) {
      if (!this.state.called) {
        this.callFirebase(nextProps.currentUser.firebaseId, nextProps.currentUser.currentCommunity._id);
        this.setState({called: true});
      }
      localStorage.setItem('community', nextProps.currentUser.currentCommunity.title);
    }
  }

  componentWillUnmount() {
    this.setState({totalUnreads: 0});
  }

  callFirebase(uid, cid) {
    const totalUnreadsRef = firebaseApp.database().ref('/totalUnreads/' + uid + '/' + cid);
    totalUnreadsRef.on( 'value', (snapshot) => {
      this.setState({totalUnreads: snapshot.val()});
    });
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
                <LeftSideContainer totalUnreads={this.state.totalUnreads}/>
                <Switch>
                    <Route path="/community/:communityName" exact component={Discover}/>
                    <Route path="/community/:communityName/conversations" component={Conversations}/>
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
  showDimmer: PropTypes.bool,
  match: PropTypes.object
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
