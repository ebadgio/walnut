import React from 'react';
import PropTypes from 'prop-types';
import { Card, Popup } from 'semantic-ui-react';
import './Discover.css';
import Linkify from 'linkifyjs/react';
import ModalContainer from '../Post/Post_Modal_Container';

const defaults = {
  attributes: null,
  className: 'linkified',
  defaultProtocol: 'http',
  events: null,
  format: (value) => {
    return value;
  },
  formatHref: (href) => {
    return href;
  },
  ignoreTags: [],
  nl2br: false,
  tagName: 'a',
  target: {
    url: '_blank'
  },
  validate: true
};

class ConversationCard extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
        <div className="myConversationCard">
            <Card className="miniPostCard">
              <Card.Content className="conversationCardContent">
                <div className="conversationCardHeader">
                  <div className="conversationCardWrapper">
                    <img className="conversationCardUserImage" src={this.props.data.pictureURL} />
                  </div>
                    <h3 className="conversationCardHeaderUser">{this.props.data.username}</h3>
                </div>
                  {this.props.data.content.split(' ').length > 4 ? <Popup inverted
                       hoverable
                       trigger={<p className="conversationCardBody">{this.props.data.content.split(' ').slice(0, 4).join(' ') + '...'}</p>}
                       content={<Linkify className="conversationCardBody" tagName="p" options={defaults}>{this.props.data.content}</Linkify>}/> :
                      <Linkify className="conversationCardBody" tagName="p" options={defaults}>{this.props.data.content}</Linkify> }
                <div className="conversationFootnote">
                  <ModalContainer mini
                                  postData={this.props.data}
                                  currentUser={this.props.user} />
                </div>
              </Card.Content>
            </Card>
        </div>
        );
  }
}

ConversationCard.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object
};

export default ConversationCard;
