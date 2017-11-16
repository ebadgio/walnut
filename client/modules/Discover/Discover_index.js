
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Feed from '../Feed/Feed_index';
import TopicContainer from './Discover_TopicSelector';
import NewPostContainer from '../Feed/Feed_NewPost_Container';
import discoverLoadThunk from '../../thunks/discover_thunks/discoverLoadThunk';
import discoverRefreshThunk from '../../thunks/discover_thunks/discoverRefreshThunk';
import getMyConvosThunk from '../../thunks/user_thunks/getMyConvosThunk';
// import firebaseApp from '../../firebase';
import NotificationContainer from '../Post/Notification';
import BottomContainer from '../Minichats/Minichat_Bottom_Container';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    const urls = this.props.location.pathname;
    sessionStorage.setItem('url', urls);
    localStorage.setItem('home', urls);
    if (this.props.isReady && (this.props.posts.length === 0)) {
      this.props.getDiscoverContent();
    } else {
      this.props.getDiscoverRefresh(this.props.lastRefresh, this.props.useFilters);
    }
  }

  render() {
    console.log('rendering discover');
    return (
        <div>
          <div className="row" id="Discover">
            <div style={{width: '200px', height: '5px'}}></div>
          {this.props.newPost.length > 0 ? this.props.newPost.map((post) => <NotificationContainer post={post} newPost />) : null}
            <Feed id="Feed"/>
            <TopicContainer />
          </div>
          <NewPostContainer />
          <BottomContainer />
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
  getConvos: PropTypes.func,
  newPost: PropTypes.object
};

const mapStateToProps = (state) => ({
  myConversations: state.conversationReducer.convos,
  isReady: state.discoverReducer.isReady,
  posts: state.discoverReducer.posts,
  lastRefresh: state.discoverReducer.lastRefresh,
  currentCommunity: state.conversationReducer.current,
  useFilters: state.discoverReducer.useFilters,
  currentUser: state.userReducer,
  newPost: state.notificationReducer.newPosts
});

const mapDispatchToProps = (dispatch) => ({
  getConvos: (convos) => dispatch(getMyConvosThunk(convos)),
  addIds: (iDs) => dispatch({type: 'ADD_IDS', iDs: iDs}),
  getDiscoverContent: () => dispatch(discoverLoadThunk()),
  getDiscoverRefresh: (lastRefresh) => dispatch(discoverRefreshThunk(lastRefresh)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

