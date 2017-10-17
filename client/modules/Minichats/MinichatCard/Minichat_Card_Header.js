import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebaseApp from '../../../firebase';
import { Icon } from 'semantic-ui-react';


class MinichatHeader extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return(
        <div className={this.props.active ? 'minichatHeaderActive' : 'minichatHeader'}
             onClick={() => this.props.toggleOpen()}>
              <div className={this.props.active ? 'headerTopicsActive' : 'headerTopics'}>
                  {this.props.postData.tags.map((tag) => ('#' + tag.name)).join(' ')}
              </div>
              <Icon name="remove"
                    className="closeChatIcon"
                    size="large"
                    onClick={() => this.props.closeChat(this.props.postData)}/>
        </div>
    );
  }
}

MinichatHeader.propTypes = {
  currentUser: PropTypes.object,
  postData: PropTypes.object,
  toggleOpen: PropTypes.func,
  active: PropTypes.bool,
  closeChat: PropTypes.func
};


export default MinichatHeader;
