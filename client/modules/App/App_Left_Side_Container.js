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
      this.setState({ pos: 1 });
    } else if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'directory') {
      this.setState({ pos: 2 });
    } else if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'map') {
      this.setState({ pos: 3 });
    } else {
      this.setState({ pos: 0 });
    }
  }

  handleClick(num) {
    this.setState({ tab: num });
  }

  navBarChoiceArt(pos) {
    this.setState({ pos: pos });
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
            <Link className={this.state.pos === 1 ? 'discoverTabActive' : 'discoverTab'} to={'/community/' + title + '/discover'}>
              <div className="leftBarLink" onClick={() => {
                this.handleClick(1);
                this.navBarChoiceArt(1);
              }}>
            <Icon name="feed" size="big" className="discoverIcon" />
              </div>
            </Link>
            <Link className={this.state.pos === 2 ? 'discoverTabActive' : 'discoverTab'} to={'/community/' + title + '/conversations'}>
              <div className="leftBarLink" onClick={() => {
                this.handleClick(2);
                this.navBarChoiceArt(2);
              }}>
            <Icon name="comments outline" size="big" />
              </div>
            </Link>
            <Link className={this.state.pos === 3 ? 'discoverTabActive' : 'discoverTab'} to={'/community/' + title + '/directory'}>
              <div className="leftBarLink" onClick={() => {
                this.handleClick(3);
                this.navBarChoiceArt(3);
              }}>
            <Icon size="big" className="address book outline" />
              </div>
            </Link>
            <Link className={this.state.pos === 4 ? 'discoverTabActive' : 'discoverTab'} to={'/community/' + title + '/map'}>
              <div className="leftBarLink" onClick={() => {
                this.handleClick(4);
                this.navBarChoiceArt(4);
              }}>
            <Icon name="browser" size="big" className="world" />
              </div>
            </Link>
        </div>
    );
  }
}

LeftSideContainer.propTypes = {
  community: PropTypes.object,
};

const mapStateToProps = (state) => ({
  community: state.userReducer.currentCommunity
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideContainer);
