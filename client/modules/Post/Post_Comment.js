import React from 'react';
import PropTypes from 'prop-types';
import { Card, Popup } from 'semantic-ui-react';
import './Post.css';
import firebaseApp from '../../firebase';
import axios from 'axios';
import LinkPreviewComment from './LinkPreviewComment';
import AttachmentPreviewComment from './Post_Modal_Attachement';

import dateStuff from '../../dateStuff';

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

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      useDate: '',
      urls: [],
      messageBody: '',
      messageBody1: '',
      messageBody2: '',
      newLink: '',
      urlName: '',
      meta: {}
    };
  }

  componentWillMount() {
    // console.log('this is the content at the start', this.props.content);
    this.setState({ useDate: this.getUseDate(this.props.createdAt) });
    const urls = this.urlFinder(this.props.content);
    if (urls.length === 0 ) {
      this.setState({ messageBody: this.props.content });
      return false;
    }
    axios.post('/db/get/linkpreview', {
      url: urls[0]
    })
    .then((response) => {
      console.log('return meta fetch', response.data.meta);
      this.setState({ meta: response.data.meta });
      if (urls.length !== 0) {
        const idx = this.props.content.indexOf(urls[0]);
        const newBody1 = this.props.content.substr(0, idx);
        const newBody2 = this.props.content.substr((idx + urls[0].length), this.props.content.length);
        const newLink = urls[0];
        if (!response.data.meta.description || !response.data.meta.title || !response.data.meta.image) {
          this.setState({ messageBody1: newBody1, messageBody2: newBody2, newLink: newLink });
        } else {
          this.setState({ messageBody1: newBody1, messageBody2: newBody2, newLink: newLink, urlName: this.urlNamer(newLink) });
        }
      }
    })
    .catch((err) => {
      console.log('error in meta scrape', err);
    });
  }

  urlNamer(url) {
    const arr = url.split('/')[2].split('.');
    let name = '';
    if (arr.length === 2) {
      name = arr[0];
    } else {
      name = arr[1];
    }
    return name;
  }


  urlFinder(text) {
    const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    const urls = [];
    text.replace(urlRegex, (url, b, c) => {
      const url2 = (c === 'www.') ? 'http://' + url : url;
      urls.push(url2);
    });
    return urls;
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
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // TODO: comments re render block
  //   console.log('preventing comments form updating');
  //   return false;
  // }


  render() {
    // console.log('attachement in comment', this.props.attachment);
    // console.log('this is re rendering', this.state.messageBody);
    const useDate = this.getUseDate(this.props.createdAt);
    if (this.props.authorId === firebaseApp.auth().currentUser.uid) {
      return (
        <Popup
        trigger={<div className="messageGroupYou" id={this.props.id}>
          {/* <div className="messageNameYou">{this.props.name.split(' ')[0]}</div>*/}
          <div className="userGroupYou">
            <Card className="commentCardYou">
              <Card.Content className="messageContent">
                <Card.Description className="messageDescriptionYou">
                    {this.state.messageBody ? this.state.messageBody :
                      <div>{this.state.messageBody1} <a href={this.state.newLink}>{this.state.urlName ? this.state.urlName : this.state.newLink}</a> {this.state.messageBody2}</div>
                    }
                </Card.Description>
              {this.state.meta.description && this.state.meta.title && this.state.meta.image ? <LinkPreviewComment meta={this.state.meta} url={this.state.newLink}/> : null}
              {this.props.attachment !== '' ? <AttachmentPreviewComment attachment={this.props.attachment}/> : null}
              </Card.Content>
            </Card>
          </div>
        </div>}
        content={this.state.useDate}
        position="right center"
        inverted />
      );
    }
    if (this.props.mini) {
      return (
            <div className="userGroupOther">
              <Popup
                  trigger={<div className="messageAvatarOtherMini">
                    <img className="postUserImage" src={this.props.authorPhoto}/>
                  </div>}
                  content={this.props.name + ' ' + this.state.useDate}
                  position="left center"
                  inverted
              />
              <div className="messageGroupOther" id={this.props.id}>
                <div className="messageNameOther">{this.props.name ? this.props.name.split(' ')[0] : ''}</div>
                <Card className="commentCardOther">
                  <Card.Content className="messageContent">
                    <Card.Description className="messageDescriptionOther">
                        {this.state.messageBody ? this.state.messageBody :
                            <div>{this.state.messageBody1} <a
                                href={this.state.newLink}>{this.state.urlName ? this.state.urlName : this.state.newLink}</a> {this.state.messageBody2}
                            </div>
                        }
                    </Card.Description>
                      {this.state.meta.description && this.state.meta.title && this.state.meta.image ?
                          <LinkPreviewComment meta={this.state.meta} url={this.state.newLink}/> : null}
                      {this.props.attachment !== '' ?
                          <AttachmentPreviewComment attachment={this.props.attachment}/> : null}
                  </Card.Content>
                </Card>
              </div>
            </div>
        );
    }
    return (
          <div className="userGroupOther">
            <Popup
                trigger={<div className="messageAvatarOther">
                  <img className="postUserImage" src={this.props.authorPhoto}/>
                </div>}
                content={this.props.name}
                position="left center"
                inverted
            />
            <Popup
                trigger={<div className="messageGroupOther" id={this.props.id}>
                  <div className="messageNameOther">{this.props.name ? this.props.name.split(' ')[0] : ''}</div>
                  <Card className="commentCardOther">
                    <Card.Content className="messageContent">
                      <Card.Description className="messageDescriptionOther">
                          {this.state.messageBody ? this.state.messageBody :
                              <div>{this.state.messageBody1} <a
                                  href={this.state.newLink}>{this.state.urlName ? this.state.urlName : this.state.newLink}</a> {this.state.messageBody2}
                              </div>
                          }
                      </Card.Description>
                        {this.state.meta.description && this.state.meta.title && this.state.meta.image ?
                            <LinkPreviewComment meta={this.state.meta} url={this.state.newLink}/> : null}
                        {this.props.attachment !== '' ?
                            <AttachmentPreviewComment attachment={this.props.attachment}/> : null}
                    </Card.Content>
                  </Card>
                </div>}
                content={this.state.useDate}
                position="left center"
                inverted/>
          </div>
      );
  }
}

Comment.propTypes = {
  postData: PropTypes.object,
  name: PropTypes.string,
  createdAt: PropTypes.string,
  content: PropTypes.string,
  currentUser: PropTypes.object,
  authorId: PropTypes.string,
  authorPhoto: PropTypes.string,
  id: PropTypes.string,
  attachment: PropTypes.object,
  mini: PropTypes.bool
};

export default Comment;
