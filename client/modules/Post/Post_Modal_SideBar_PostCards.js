import React from 'react';
import PropTypes from 'prop-types';
import { connect} from 'react-redux';
import { Card, Popup, Icon, Segment } from 'semantic-ui-react';
import Linkify from 'linkifyjs/react';
import dateStuff from '../../dateStuff';
import firebaseApp from '../../firebase';
import _ from 'underscore';

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
  members: [],
  membersCount: 0,
  unread: 0,
  validate: true
};

class ConversationCard extends React.Component {
  constructor() {
    super();
    this.state = {
      unreads: 0,
      isFollowing: false
    };
  }

  componentDidMount() {
    const user = firebaseApp.auth().currentUser;
    this.setState({ user: user, timeStamp: this.getUseDate(this.props.data.createdAt) });
    const membersRef = firebaseApp.database().ref('/members/' + this.props.data.postId);
    membersRef.on('value', (snapshot) => {
      const peeps = _.values(snapshot.val());
      const members = peeps.filter((peep) => typeof (peep) === 'object');
      this.setState({ membersCount: members.length, members: members });
    });
    const countRef = firebaseApp.database().ref('/counts/' + this.props.data.postId + '/count');
    countRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({count: snapshot.val()});
      }
    });

    // Unreads stuff
    firebaseApp.database().ref('/unreads/' + user.uid + '/' + this.props.data.postId).on('value', snapshotB => {
      const unreadCount =  snapshotB.val();
      if ( !this.state.current && !isNaN(unreadCount) && unreadCount !== null) {
        this.setState({unreads: unreadCount});
      }
    });

    // Getting # followers of this post
    const followersRef = firebaseApp.database().ref('/followGroups/' + this.props.data.postId);
    followersRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        const followers = Object.keys(snapshot.val());
        this.setState({numFollowers: followers.length});
      }
    });
  }


  getUseDate(dateObj) {
    if (dateObj) {
      const now = new Date().toString().slice(4, 24).split(' ');
      const date = new Date(dateObj);
      const dateString = date.toString().slice(4, 24);
      const split = dateString.split(' ');
      const useMonth = dateStuff.months[split[0]];
      const useDay = dateStuff.days[split[1]];
      const timeArr = split[3].split(':');
      let time;
      let hour;
      let isPM;
      if (parseInt(timeArr[0], 10) > 12) {
        hour = parseInt(timeArr[0], 10) - 12;
        isPM = true;
      } else {
        if (parseInt(timeArr[0], 10) === 0) {
          hour = 12;
        } else {
          hour = parseInt(timeArr[0], 10);
        }
      }
      const min = timeArr[1];
      if (isPM) {
        time = hour + ':' + min + 'PM';
      } else {
        time = hour + ':' + min + 'AM';
      }
      if (now[2] !== split[2]) {
        return useMonth + ' ' + useDay + ', ' + split[2] + ' ' + time;
      }
      return useMonth + ' ' + useDay + ', ' + time;
    }
    return '-';
  }

  render() {
    return (
        <Card className={this.props.current ? 'miniPostCardModalCurrent' : 'miniPostCardModal'}>
          <Card.Content className="conversationCardContenModal" onClick={() => { this.props.openModal(this.props.data); }}>
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
                <div className="messageInfoGroupMini">
                  <span className="followNumMini">
                    {this.state.numFollowers}{this.state.numFollowers === 1 ? ' follower' : ' followers'}
                  </span>
                  <span className="commentNumMini">{this.state.count}{' messages'}</span>
                  <span className={this.state.unreads > 0 ? 'isUnreadMini' : 'noUnreadMini'}>
                    {this.state.unreads}{' unread'}
                  </span>
                </div>
                <div className="commentDiv">
                    <span className="userNum">{this.state.membersCount > 0 ? this.state.membersCount : ''}</span>
                    <Icon size="large" name="users" className="usersIconMini" />
                </div>
            </div>
          </Card.Content>
        </Card>
    );
  }
}

ConversationCard.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object,
  openModal: PropTypes.func,
  current: PropTypes.bool
};

const mapDispatchToProps = (dispatch) => ({
  openModal: (postData) => dispatch({type: 'MAKE_OPEN', postData: postData})
});


export default connect(null, mapDispatchToProps)(ConversationCard);
