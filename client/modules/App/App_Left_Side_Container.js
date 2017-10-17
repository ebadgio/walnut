import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import FollowedPosts from './Discover_Left_FollowedPosts';
// import Online from './Discover_Online';
import './App.css';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';


const borderColors = {
  discover: '#4E148C',
  conversations: '#613DC1',
  directory: '#858AE3',
  map: '#97DFFC'
};

const borderColors2 = {
  discover: '#4EAABA',
  conversations: '#6874e8',
  // directory: '#EF946C',
  directory: '#A9BCD0',
  map: '#A18C87'
};

class LeftSideContainer extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
    this.navBarChoice();
  }


  navBarChoice() {
    setInterval(() => {
      if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'discover') {
        this.setState({tab: 1});
      } else if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'conversations') {
        this.setState({tab: 2});
      } else if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'directory') {
        this.setState({tab: 3});
      } else if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'map') {
        this.setState({tab: 4});
      } else {
        this.setState({tab: 0});
      }
    }, 200);
  }

  render() {
    let title;
    if (this.props.community) {
      title = this.props.community.title ? this.props.community.title.split(' ').join('') : 'bet';
    } else {
      title = 'missing';
    }
    return (
        <div className="LeftSidebar_Container">
            {/* <FollowedPosts />
            <Online /> */}
            <Link className={this.state.tab === 1 ? 'discoverTabActive' : 'discoverTab'}
                  to={'/community/' + title + '/discover'}
                  style={{borderColor: borderColors2.discover}}>
                <Icon name="browser" size="big" className="discoverIcon" />
            </Link>
            <Link className={this.state.tab === 2 ? 'discoverTabActive' : 'discoverTab'}
                  to={'/community/' + title + '/conversations'}
                  style={{borderColor: borderColors2.conversations}}>
                <Icon name="comments outline" size="big" />
            </Link>
            <Link className={this.state.tab === 3 ? 'discoverTabActive' : 'discoverTab'}
                  to={'/community/' + title + '/directory'}
                  style={{borderColor: borderColors2.directory}}>
                <Icon size="big" className="address book outline" />
            </Link>
            <Link className={this.state.tab === 4 ? 'discoverTabActive' : 'discoverTab'}
                  to={'/community/' + title + '/map'}
                  style={{borderColor: borderColors2.map}}>
                <Icon name="browser" size="big" className="world" />
            </Link>
        </div>
    );
  }
}

LeftSideContainer.propTypes = {
  community: PropTypes.object,
};

const mapStateToProps = (state) => ({
  community: state.userReducer.currentCommunity,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideContainer);
