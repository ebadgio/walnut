import React from 'react';
import PropTypes from 'prop-types';
import ModalContainer from './Post_Modal_Container';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const styles = {
  post: {
    width: '30%'
  },
  comment: {
    float: 'right'
  },
  tag: {
    fontSize: '20px'
  },
  hashtag: {
    color: '#0D9ED3',
    fontSize: '18px'
  }
};


class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      likeCount: this.props.postData.likes.length,
      isLiked: this.props.postData.likes.indexOf(this.props.currentUser._id) > 0
    };
  }

  handleClick() {
    this.setState({isOpen: !this.state.isOpen});
  }

  toggleLike() {
    if (this.state.isLiked) {
      this.props.newLike();
      this.setState({likeCount: this.state.likeCount - 1, isLiked: false});
    } else {
      this.props.newLike();
      this.setState({likeCount: this.state.likeCount + 1, isLiked: true});
    }
  }

  render() {
    console.log(this.props.postData);
    return (
      <Card style={styles.post}>
      <Card.Content>
        <Image floated="left" size="mini" src="http://cdnak1.psbin.com/img/mw=160/mh=210/cr=n/d=q864a/dpe4wfzcew4tph99.jpg" />
        <Card.Header>
          {this.props.postData.username}
        </Card.Header>
        <Card.Meta>
          {this.props.postData.tags.map((tag, index) => (
            <text key={index} style={styles.tag}>
              <text style={styles.hashtag}>#</text>
            {tag.name}   </text>))}
        </Card.Meta>
        <Card.Description>
          {this.props.postData.content}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <a onClick={() => this.toggleLike()}>
          <Icon name="thumbs outline up" />
          {this.state.likeCount}
        </a>
        <a style={styles.comment} onClick={() => this.handleClick()} floated="right">
          <Icon name="comment outline" />
          {this.props.postData.comments.length}
        </a>
      </Card.Content>
      <ModalContainer isOpen={this.state.isOpen} postData={this.props.postData} onClick={() => this.handleClick()}/>
    </Card>
    );
  }
}

/* This is the old post code:
      <div className="card" style={{backgroundColor: '#ececec', width: '100%', float: 'right', marginRight: '2%'}}>
        <div style={{textAlign: 'center'}}>
          {this.props.postData.tags.map((tag, index) => (<text key={index} style={{fontSize: '14px'}}><text
                    style={{color: '#0D9ED3', fontSize: '14px'}}>#</text>{tag.name}   </text>))}
        </div>
        <div className="card-block">
          <span>
          <img style={{borderRadius: '50%', float: 'left', height: '40px'}}
                  src="http://cdnak1.psbin.com/img/mw=160/mh=210/cr=n/d=q864a/dpe4wfzcew4tph99.jpg"
                  alt="5" />
          <h4 className="card-title" style={{fontSize: '14px'}}>{this.props.postData.username}</h4> </span>
          <p className="card-text" style={{paddingLeft: '10%'}}><br/>{this.props.postData.content}</p>
          <div>
            <a style={{backgroundColor: '#0D9ED3', float: 'left'}}
              className="waves-effect waves-light btn btn-primary"
              onClick={() => this.toggleLike()}><i
                className="material-icons left">thumb_up</i>{this.state.likeCount}</a>
          </div>
          <div>
            <a style={{backgroundColor: '#0D9ED3', float: 'right'}}
              className="waves-effect waves-light btn btn-primary" onClick={() => this.handleClick()}><i
                className="material-icons left">comment</i>{commentNum}</a>
          </div>
          <br/> <br/>
          <ModalContainer isOpen={this.state.isOpen} postData={this.props.postData} onClick={() => this.handleClick()}/>
        </div>
      </div>
*/

Post.propTypes = {
  postData: PropTypes.object,
  newLike: PropTypes.func,
  currentUser: PropTypes.object
};

export default Post;
