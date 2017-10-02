import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import FollowedPosts from './Discover_Left_FollowedPosts';
// import Online from './Discover_Online';
import './App.css';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

class LeftSideContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      pos: 1
    };
  }

  componentDidMount() {
    this.navBarChoice();
  }

  navBarChoice() {
    if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'discover') {
      this.changeTab(1);
    } else if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'directory') {
      this.changeTab(3);
    } else if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'map') {
      this.changeTab(4);
    } else {
      this.changeTab(0);
    }
  }

  changeTab(n) {
    this.setState({ pos: n });
  }

  render() {
    let title;
    if (this.props.community) {
      title = this.props.community.title ? this.props.community.title.split(' ').join('') : 'bet';
    } else {
      title = 'missing';
    }
    console.log('tab here', this.state.pos);
    return (
        <div className="LeftSidebar_Container">
            {/* <FollowedPosts />
            <Online /> */}
            <Link className={this.state.pos === 1 ? 'discoverTabActive' : 'discoverTab'}
                  to={'/community/' + title + '/discover'}
                  onClick={() => {
                    this.changeTab(1);
                  }}>
              <div className="leftBarLink">
            <Icon name="feed" size="big" className="discoverIcon" />
              </div>
            </Link>
            <Link className={this.state.pos === 2 ? 'discoverTabActive' : 'discoverTab'}
                  to={'/community/' + title + '/conversations'}
                  onClick={() => {
                    this.changeTab(2);
                  }}>
              <div className="leftBarLink">
            <Icon name="comments outline" size="big" />
              </div>
            </Link>
            <Link className={this.state.pos === 3 ? 'discoverTabActive' : 'discoverTab'}
                  to={'/community/' + title + '/directory'}
                  onClick={() => {
                    this.changeTab(3);
                  }}>
              <div className="leftBarLink">
            <Icon size="big" className="address book outline" />
              </div>
            </Link>
            <Link className={this.state.pos === 4 ? 'discoverTabActive' : 'discoverTab'}
                  to={'/community/' + title + '/map'}
                  onClick={() => {
                    this.changeTab(4);
                  }}>
              <div className="leftBarLink">
            <Icon name="browser" size="big" className="world" />
              </div>
            </Link>
        </div>
    );
  }
}

LeftSideContainer.propTypes = {
  community: PropTypes.object,
  tab: PropTypes.number
};

const mapStateToProps = (state) => ({
  community: state.userReducer.currentCommunity
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideContainer);
