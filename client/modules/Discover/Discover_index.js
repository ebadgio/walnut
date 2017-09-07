
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Feed from '../Feed/Feed_index';
import LeftSideBar from './Discover_Left_Sidebar_Container';
import RightSideBar from './Discover_Right_Sidebar_Container';
import ConversationCard from './Discover_My_Conversations_Card';
import discoverLoadThunk from '../../thunks/discover_thunks/discoverLoadThunk';
import discoverRefreshThunk from '../../thunks/discover_thunks/discoverRefreshThunk';
import {Sidebar, Button, Icon, Sticky, Loader} from 'semantic-ui-react';
import firebaseApp from '../../firebase';
import _ from 'underscore';
import uuidv4 from 'uuid/v4';
import getMyConvosThunk from '../../thunks/user_thunks/getMyConvosThunk';
import Online from './Discover_Online';
import FollowedPostsContainer from './Discover_My_Conversation_Container';
import WalnutLoader from '../App/App_WalnutLoader';


class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    const urls = this.props.location.pathname;
    console.log(urls);
    localStorage.setItem('url', urls);
    sessionStorage.setItem('url', urls);
    localStorage.setItem('home', urls);
    if (this.props.isReady && (this.props.posts.length === 0)) {
      console.log('in here');
      this.props.getDiscoverContent();
    } else {
      this.props.getDiscoverRefresh(this.props.lastRefresh, this.props.useFilters);
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('yoyoyoyoyo');
  //   if (nextProps.isReady && !this.props.isReady) {
  //     this.props.getDiscoverContent();
  //   }
  // }

  render() {
    return (
        <div className="row" id="Discover">
          <LeftSideBar/>
          <Online/>
          <Feed id="Feed"/>
          <FollowedPostsContainer/>
        </div>
    );
  }
}

Home.propTypes = {
  getDiscoverContent: PropTypes.func,
  isReady: PropTypes.bool,
  location: PropTypes.object,
  posts: PropTypes.array,
  getDiscoverRefresh: PropTypes.func,
  lastRefresh: PropTypes.string,
  currentCommunity: PropTypes.object,
  updateCom: PropTypes.func,
  useFilters: PropTypes.array,
  myConversations: PropTypes.array,
  currentUser: PropTypes.object,
  addIds: PropTypes.func,
  getConvos: PropTypes.func
};

const mapStateToProps = (state) => ({
  myConversations: state.conversationReducer.convos,
  isReady: state.discoverReducer.isReady,
  posts: state.discoverReducer.posts,
  lastRefresh: state.discoverReducer.lastRefresh,
  currentCommunity: state.conversationReducer.current,
  useFilters: state.discoverReducer.useFilters,
  currentUser: state.userReducer
});

const mapDispatchToProps = (dispatch) => ({
  getConvos: (convos) => getMyConvosThunk(convos)(dispatch),
  addIds: (iDs) => dispatch({type: 'ADD_IDS', iDs: iDs}),
  getDiscoverContent: () => dispatch(discoverLoadThunk()),
  getDiscoverRefresh: (lastRefresh) => dispatch(discoverRefreshThunk(lastRefresh)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

