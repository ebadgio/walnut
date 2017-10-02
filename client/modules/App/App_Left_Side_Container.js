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
      this.props.changeTab(1);
    } else if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'directory') {
      this.props.changeTab(3);
    } else if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'map') {
      this.props.changeTab(4);
    } else {
      this.props.changeTab(0);
    }
  }



  render() {
    let title;
    if (this.props.community) {
      title = this.props.community.title ? this.props.community.title.split(' ').join('') : 'bet';
    } else {
      title = 'missing';
    }
    console.log('tab here', this.props.tab);
    return (
        <div className="LeftSidebar_Container">
            {/* <FollowedPosts />
            <Online /> */}
            <Link className={this.props.tab === 1 ? 'discoverTabActive' : 'discoverTab'}
                  to={'/community/' + title + '/discover'}
                  onClick={() => {
                    this.props.changeTab(1);
                  }}>
              <div className="leftBarLink">
            <Icon name="feed" size="big" className="discoverIcon" />
              </div>
            </Link>
            <Link className={this.props.tab === 2 ? 'discoverTabActive' : 'discoverTab'}
                  to={'/community/' + title + '/conversations'}
                  onClick={() => {
                    this.props.changeTab(2);
                  }}>
              <div className="leftBarLink">
            <Icon name="comments outline" size="big" />
              </div>
            </Link>
            <Link className={this.props.tab === 3 ? 'discoverTabActive' : 'discoverTab'}
                  to={'/community/' + title + '/directory'}
                  onClick={() => {
                    this.props.changeTab(3);
                  }}>
              <div className="leftBarLink">
            <Icon size="big" className="address book outline" />
              </div>
            </Link>
            <Link className={this.props.tab === 4 ? 'discoverTabActive' : 'discoverTab'}
                  to={'/community/' + title + '/map'}
                  onClick={() => {
                    this.props.changeTab(4);
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
  tab: PropTypes.number,
  changeTab: PropTypes.func
};

const mapStateToProps = (state) => ({
  community: state.userReducer.currentCommunity,
  tab: state.navBarReducer
});

const mapDispatchToProps = (dispatch) => ({
  changeTab: (tab) => dispatch({type: 'CHANGE_NAVBAR_TAB', tab: tab})
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideContainer);
