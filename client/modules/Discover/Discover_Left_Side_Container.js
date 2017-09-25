import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FollowedPosts from './Discover_Left_FollowedPosts';
import Online from './Discover_Online';

import './Discover.css';
class LeftSideContainer extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }


  render() {
    return (
        <div className="LeftSidebar_Container">
            <FollowedPosts />
            <Online />
        </div>
    );
  }
}

LeftSideContainer.propTypes = {
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideContainer);
