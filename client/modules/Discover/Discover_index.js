
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Feed from '../Feed/Feed_index';
// import LeftSideBar from './Discover_Left_Sidebar_Container';
import TopicContainer from './Discover_TopicSelector';
// import LeftSideContainer from './Discover_Left_Side_Container';
import NewPostContainer from '../Feed/Feed_NewPost_Container';
import discoverLoadThunk from '../../thunks/discover_thunks/discoverLoadThunk';
import discoverRefreshThunk from '../../thunks/discover_thunks/discoverRefreshThunk';
import getMyConvosThunk from '../../thunks/user_thunks/getMyConvosThunk';
import Online from './Discover_Online';
// import FollowedPostsContainer from './Discover_My_Conversation_Container';
import ModalContainer from '../Post/Post_Modal_Container';
// import firebaseApp from '../../firebase';
import _ from 'underscore';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    const urls = this.props.location.pathname;
    localStorage.setItem('url', urls);
    sessionStorage.setItem('url', urls);
    localStorage.setItem('home', urls);
    if (this.props.isReady && (this.props.posts.length === 0)) {
      this.props.getDiscoverContent();
    } else {
      this.props.getDiscoverRefresh(this.props.lastRefresh, this.props.useFilters);
    }
  }

  render() {
    return (
        <div className="row" id="Discover">
          <TopicContainer />
          <Feed id="Feed"/>
          <NewPostContainer />
          <ModalContainer />
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
  getConvos: (convos) => dispatch(getMyConvosThunk(convos)),
  addIds: (iDs) => dispatch({type: 'ADD_IDS', iDs: iDs}),
  getDiscoverContent: () => dispatch(discoverLoadThunk()),
  getDiscoverRefresh: (lastRefresh) => dispatch(discoverRefreshThunk(lastRefresh)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

