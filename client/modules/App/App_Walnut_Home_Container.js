import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './App.css';
import { history } from '../Auth/Auth_index';
import JoinCommunityCode from './App_JoinCommunityCode';
import createCommunityThunk from '../../thunks/community_thunks/createCommunityThunk';
import joinCommunityThunk from '../../thunks/community_thunks/joinCommunityThunk';
import getAllCommunitiesThunk from '../../thunks/community_thunks/getAllCommunitiesThunk';
import updateUserCommunityThunk from '../../thunks/user_thunks/updateUserCommunityThunk';
import CommunityCard from './App_CommunityCard';
import NewCommunityModal from './App_NewCommunityModal';
import WalnutLoader from './App_WalnutLoader';
import signOutThunk from '../../thunks/auth_thunks/signOutThunk';
import joinCommunityCodeThunk from '../../thunks/community_thunks/joinCommunityCodeThunk';

class WalnutHomeContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      isCalled: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.joinCommunity = this.joinCommunity.bind(this);
  }


  componentWillMount() {
    this.props.getAllCommunities();
    // if (this.props.loginFirebase === true) {
    //   this.props.handleLogout(history);
    // }
  }

  componentDidMount() {
    sessionStorage.setItem('url', '/walnuthome');

    // AUTO JOIN WITH LINK
    if (this.props.savedCode) {
      this.props.submitCode(this.props.savedCode);
    }

    // Safari + firefox session issue bandaid
    setTimeout(() => {
      if (!this.props.fullName) {
        console.log('CLEARING');
        localStorage.clear();
        history.replace('/');
        alert('Please login in again to continue. We are currently experiencing issues with Cookies in ' +
                ' Safari/Firefox Sorry for the inconvenience.');
      }
    }, 10000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCreated && !this.state.isCalled) {
      nextProps.getAllCommunities();
      this.setState({ isCalled: true });
    }
  }

  toggleCommunity(com) {
    this.props.updateConvos(com._id);
    this.props.changeCommunity(com);
  }

  handleSubmit(image, titleValue, defaultFilters) {
    this.props.createCommunity(image, titleValue, defaultFilters);
    // window.location.reload();
  }

  handleLogout() {
    this.props.handleLogout(history);
  }

  joinCommunity(id) {
    this.props.joinCommunity(id);
  }


  render() {
    if (this.props.isReady) {
      const userCommunityTitles = this.props.userCommunities.map((com) => com.title);
      return (
        <div className="walnutContainer">
          <div className="Heading">
            <img src="https://s3.amazonaws.com/walnut-logo/logo.svg" className="logoHome"/>
            <span style={{fontSize: '45px'}}>Walnut</span>
            <div className="logout_button" onClick={() => this.handleLogout()}>
              Logout
            </div>
          </div>
          <div className="walnutHomeActions">
            <JoinCommunityCode />
            <NewCommunityModal
              handleCreate={(image, title, defaultFilters) => this.handleSubmit(image, title, defaultFilters)} />
          </div>
          <div className="subHead">Your Communities</div>
          <div className="communitiesContainer">
            {this.props.userCommunities.map((community, idx) =>
              <Link key={community._id}
                className="communityLink"
                onClick={() => this.toggleCommunity(community)}
                to={'/community/' + community.title.split(' ').join('') + '/discover'}>
                <CommunityCard joined
                  icon={community.icon}
                  title={community.title}/>
              </Link>)}
          </div>
          <h2 className="subHead">Search For new Communities</h2>
          <div className="communitiesContainerOther">
            {this.props.communities.filter((com) => {
              return !(userCommunityTitles.indexOf(com.title) > -1);
            })
            .filter((com) => com.status !== 'secret' )
            .map((community, idx) =>
            <CommunityCard icon={community.icon}
              title={community.title}
              status={community.status}
              communityId={community._id}
              join={this.joinCommunity}
              key={community._id} />)
            }
          </div>
        </div>
      );
    }
    return (
      <WalnutLoader />
    );
  }
}

WalnutHomeContainer.propTypes = {
  createCommunity: PropTypes.func,
  hasProfile: PropTypes.bool,
  getUser: PropTypes.func,
  communities: PropTypes.array,
  joinCommunity: PropTypes.func,
  getCommunities: PropTypes.func,
  userCommunities: PropTypes.array,
  changeCommunity: PropTypes.func,
  getAllCommunities: PropTypes.func,
  isCreated: PropTypes.bool,
  updateConvos: PropTypes.func,
  isReady: PropTypes.bool,
  handleLogout: PropTypes.func,
  loginFirebase: PropTypes.bool,
  errorDone: PropTypes.func,
  savedCode: PropTypes.string,
  submitCode: PropTypes.func,
  fullName: PropTypes.string
};

const mapStateToProps = (state) => ({
  fullName: state.userReducer.fullName,
  hasProfile: state.userReducer.hasProfile,
  userCommunities: state.userReducer.communities,
  communities: state.getCommunityReducer.communities,
  isReady: state.walnutHomeReducer.isReady,
  loginFirebase: state.userReducer.loginFirebase,
  savedCode: state.walnutHomeReducer.code
});

const mapDispatchToProps = (dispatch) => ({
  joinCommunity: (id) => dispatch(joinCommunityThunk(id)),
  createCommunity: (image, title, filters) => dispatch(createCommunityThunk(image, title, filters)),
  changeCommunity: (updateObj) => dispatch(updateUserCommunityThunk(updateObj)),
  getAllCommunities: () => dispatch(getAllCommunitiesThunk()),
  updateConvos: (id) => dispatch({ type: 'SWITCH_COM', communityId: id }),
  handleLogout: (his) => dispatch(signOutThunk(his)),
  errorDone: () => dispatch({ type: 'JOINING_CODE_ERROR_DONE'}),
  submitCode: (code) => dispatch(joinCommunityCodeThunk(code))
});

export default connect(mapStateToProps, mapDispatchToProps)(WalnutHomeContainer);
