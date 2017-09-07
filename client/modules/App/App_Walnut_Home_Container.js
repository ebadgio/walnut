import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import './App.css';
import createCommunityThunk from '../../thunks/community_thunks/createCommunityThunk';
import joinCommunityThunk from '../../thunks/community_thunks/joinCommunityThunk';
import getAllCommunities from '../../thunks/community_thunks/getAllCommunitiesThunk';
import updateUserCommunityThunk from '../../thunks/user_thunks/updateUserCommunityThunk';
import CommunityCard from './App_CommunityCard';
import NewCommunityModal from './App_NewCommunityModal';
import {Loader} from 'semantic-ui-react';
import WalnutLoader from './App_WalnutLoader';


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
  }

  componentDidMount() {
    localStorage.setItem('url', '/walnuthome');
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
    console.log('filters in handle submit ', defaultFilters);
    this.props.createCommunity(image, titleValue, defaultFilters);
    // window.location.reload();
  }


  joinCommunity(id) {
    this.props.joinCommunity(id);
  }


  // TODO HORIZONS
  render() {
    if (this.props.isReady) {
      const userCommunityTitles = this.props.userCommunities.map((com) => com.title);
      return (
            <div className="walnutContainer">
              <div className="Heading">
                <h1>Walnut</h1>
                <hr/>
              </div>
              <div>
                <NewCommunityModal
                    handleCreate={(image, title, defaultFilters) => this.handleSubmit(image, title, defaultFilters)}/>
              </div>
              <h2 className="subHead">Your Communities</h2>
              <div className="communitiesContainer">
                  {this.props.userCommunities.map((community, idx) =>
                      <Link key={idx}
                            onClick={() => this.toggleCommunity(community)}
                            to={'/community/' + community.title.split(' ').join('') + '/discover'}>
                        <CommunityCard joined
                                       icon={community.icon}
                                       title={community.title}
                                       key={idx}/></Link>)}
              </div>
              <h2 className="subHead">Search For new Communities</h2>
              <div className="communitiesContainer">
                  {this.props.communities.filter((com) => {
                    return !(userCommunityTitles.indexOf(com.title) > -1);
                  }).map((community, idx) => <CommunityCard icon={community.icon}
                                                            title={community.title}
                                                            communityId={community._id}
                                                            join={this.joinCommunity}
                                                            key={idx}/>)
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
  isReady: PropTypes.bool
};

const mapStateToProps = (state) => ({
  hasProfile: state.userReducer.hasProfile,
  userCommunities: state.userReducer.communities,
  communities: state.getCommunityReducer.communities,
  isCreated: state.userReducer.isCreated,
  isReady: state.walnutHomeReducer
});

const mapDispatchToProps = (dispatch) => ({
  joinCommunity: (id) => dispatch(joinCommunityThunk(id)),
  createCommunity: (image, title, filters) => dispatch(createCommunityThunk(image, title, filters)),
  changeCommunity: (updateObj) => dispatch(updateUserCommunityThunk(updateObj)),
  getAllCommunities: () => dispatch(getAllCommunities()),
  updateConvos: (id) => dispatch({type: 'SWITCH_COM', communityId: id})
});

export default connect(mapStateToProps, mapDispatchToProps)(WalnutHomeContainer);
