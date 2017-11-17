import React from 'react';
import PropTypes from 'prop-types';


class NewMemberBanner extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
        <div className="new_member_banner">
            <div className="imageWrapperPost">
                <img className="postUserImage" src={this.props.data.pictureURL}/>
            </div>
            <b>{this.props.data.username}</b>
            <span className="banner_content">{this.props.data.content}</span>
        </div>
    );
  }
}

NewMemberBanner.propTypes = {
  data: PropTypes.object
};

export default NewMemberBanner;




