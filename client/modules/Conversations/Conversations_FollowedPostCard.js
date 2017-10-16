import React from 'react';
import PropTypes from 'prop-types';
import { connect} from 'react-redux';
import { Card, Popup, Icon, Segment } from 'semantic-ui-react';
import Linkify from 'linkifyjs/react';
import dateStuff from '../../dateStuff';
import firebaseApp from '../../firebase';
import _ from 'underscore';
import '../Discover/Discover.css';

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
  validate: true,
  unreads: 0,
  lastMessage: {}
};

class ConversationCard extends React.Component {
  constructor() {
    super();
    this.state = {
      numFollowers: 0,
      lastMessage: {},
      members: [],
      membersCount: 0,
      unreads: 0,
    };
  }

  componentDidMount() {
    const user = firebaseApp.auth().currentUser;
    this.setState({ user: user, timeStamp: this.getUseDate(this.props.data.createdAt)});
    const membersRef = firebaseApp.database().ref('/members/' + this.props.data.postId);
    membersRef.on('value', (snapshot) => {
      const peeps =  _.values(snapshot.val());
      const members = peeps.filter((peep) => typeof (peep) === 'object');
      this.setState({membersCount: members.length, members: members});
    });
    const countRef = firebaseApp.database().ref('/counts/' + this.props.data.postId + '/count');
    countRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({count: snapshot.val()});
      }
    });

    // unreads stuff
    firebaseApp.database().ref('/unreads/' + user.uid + '/' + this.props.data.postId).on('value', snapshotB => {
      const unreadCount =  snapshotB.val();
      if (!isNaN(unreadCount) && unreadCount !== null) {
        this.setState({unreads: unreadCount});
      }
    });

    // Getting # followers of this post
    const followersRef = firebaseApp.database().ref('/followGroups/' + this.props.data.postId);
    followersRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        const followers = Object.keys(snapshot.val());
        const num = followers.length;
        // this.props.sumUnreads(this.props.data.postId, num);
        this.setState({numFollowers: num});
      }
    });

    // Last message stuff
    firebaseApp.database().ref('/lastMessage/' + this.props.data.postId).on('value', snapshotC => {
      if (snapshotC.val()) {
        const lastMessage =  snapshotC.val();
        if (lastMessage.author && lastMessage.content) {
          this.setState({lastMessage: lastMessage});
        }
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

  switching() {
    this.props.togglePostData(this.props.data);
    // TODO: set unreads to 0
  }

  render() {
    return (
        <Segment className={this.props.postDataId === this.props.data.postId ? 'miniPostCardActive' : 'miniPostCard'}
                 onClick={() => this.switching()}>
          <div className="conversationCardContent" >
            <div className="conversationCardHeader">
                {this.props.data.tags.map((tag, index) => (
                    <div key={index} className="tag">
                      <text className="hashtag">#{' ' + tag.name}</text>
                    </div>))}
            </div>
            <div className="lastMessageBox">{this.state.lastMessage.author ?
                this.state.lastMessage.author + ': ' + this.state.lastMessage.content : 'No messages to display yet' }</div>
            <div className="conversationFootnote">
              <div className="messageInfoGroupMini">
                <span className="activeNumMini">
                  {this.state.membersCount > 0 ? this.state.membersCount + ' active' : null}
                </span>
                <span className="followNumMini">
                  {this.state.numFollowers}{this.state.numFollowers === 1 ? ' follower' : ' followers'}
                </span>
                <span className="commentNumMini">{this.state.count}{' messages'}</span>
                <span className={this.state.unreads > 0 ? 'isUnreadMini' : 'noUnreadMini'}>
                  {this.state.unreads}{' unread'}
                </span>
              </div>
            </div>
          </div>
        </Segment>
      );
  }
}

ConversationCard.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object,
  toggleModal: PropTypes.func,
  handleSelect: PropTypes.func,
  sumUnreads: PropTypes.func,
  togglePostData: PropTypes.func,
  postDataId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  postDataId: state.messengerReducer.postDataId
});

const mapDispatchToProps = (dispatch) => ({
});


export default connect(mapStateToProps, null)(ConversationCard);
