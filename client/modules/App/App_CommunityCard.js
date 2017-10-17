
import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { Card, Segment, Button, Icon } from 'semantic-ui-react';


class CommunityCard extends React.Component {

  render() {
    if (this.props.joined) {
      return (
          <div className="communityCard">
              <img className="communityCardImage" src={this.props.icon} />
              <div className="communityCardTitle">
                {this.props.title}
              </div>
          </div>
      );
    }
    return (
      <div className="communityCardOther">
          <img className="communityCardImage" src={this.props.icon} />
          <div className="communityCardTitle">
            {this.props.title}
          </div>
          <div>
              {this.props.status === 'public' ?
                    <Button className="joinButton" onClick={() => this.props.join(this.props.communityId)} content="Join" icon="plus" labelPosition="left" />
                        : null}
          </div>
      </div>
    );
  }
}


CommunityCard.propTypes = {
  joined: PropTypes.bool,
  icon: PropTypes.string,
  title: PropTypes.string,
  join: PropTypes.func,
  communityId: PropTypes.string,
  status: PropTypes.string
};


export default CommunityCard;
