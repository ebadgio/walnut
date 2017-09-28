// dispatches NewPost

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TagPrefContainer from './Feed_NewPost_TagPref_Container';
import newPostThunk from '../../thunks/post_thunks/newPostThunk';
import $ from 'jquery';
import { Icon, Button, TextArea, Form, Divider, Popup, Segment, Portal } from 'semantic-ui-react';
import superagent from 'superagent';
import './Feed.css';
import firebaseApp from '../../firebase';

// TODO input that takes in content of post with # dropdown selector
// input is string # is array
// TODO post button dispatches newPost
// userPost is the string that gets updated in reducer

let user;

class NewPostContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postBody: '',
      newFileName: null,
      file: '',
    };
  }


  componentDidMount() {
    user = firebaseApp.auth().currentUser;
  }


  addTags(tag) {
    if (this.props.postTags.filter((t) => t._id === tag._id).length === 0) {
      this.props.addTag(tag);
    }
  }

  addNewTags(tag) {
    if (this.props.postTags.filter((t) => t.name === tag).length === 0 &&
        this.props.newPostTags.filter((t) => t === tag).length === 0) {
      this.props.newTag(tag);
    }
    // this.setState({postTags: this.state.postTags.concat([tag])});
  }

  // removeTag(tag) {
  //   const newTagsCopy = this.state.newTags.slice();
  //   newTagsCopy.splice(newTagsCopy.indexOf(tag), 1);
  //   this.setState({newTags: newTagsCopy});
  // }

  handleChange(e) {
    this.setState({postBody: e.target.value});
  }

  submitPost() {
    this.setState({ open: false });
    this.props.dimmerOff();
    if (this.state.file !== '') {
      superagent.post('/aws/upload/post')
      .field('body', this.state.postBody ? this.state.postBody : '')
      .field('tags', this.props.postTags ? this.props.postTags.map((tag) => tag._id) : [])
      .field('useFilters', this.props.useFilters ? this.props.useFilters.map((tag) => tag._id) : [])
      .field('newTags', this.props.newPostTags ? this.props.newPostTags : [])
      .field('name', this.state.newFileName ? this.state.newFileName : '')
      .field('lastRefresh', this.props.lastRefresh)
      .attach('attach', this.state.file)
      .end((err, res) => {
        if (err) {
          console.log(err);
          alert('failed uploaded!');
        }
        const updates = {};
        updates['/follows/' + user.uid + '/' + res.body.userComm + '/' + res.body.postId] = true;
        updates['/followGroups/' + res.body.postId + '/' + user.uid] = true;
        firebaseApp.database().ref().update(updates);
        this.props.clearPostTag();
        const elem = document.getElementById('textarea1');
        elem.value = '';
        this.setState({postBody: '', file: '', newFileName: null});
        this.props.refreshDiscover(res.body.posts, res.body.lastRefresh, res.body.otherTags);
      });
    } else {
      if (this.state.postBody && this.state.file === '') {
        this.props.newPost(this.state.postBody, this.props.postTags.map((tag) => tag._id), this.props.newPostTags, this.props.lastRefresh, this.props.useFilters);
        const elem = document.getElementById('textarea1');
        elem.value = '';
        this.setState({ postBody: '', file: ''});
        this.props.clearPostTag();
      } else {
        this.setState({emptyBody: true});
        setTimeout(() => this.setState({emptyBody: false}), 2000);
      }
    }
  }

  upload() {
    const myFile = $('#fileInputNewpost').prop('files');
    this.setState({ file: myFile[0] });
  }

  changeFileName(name) {
    this.setState({newFileName: name});
  }

  handleRemove(tag) {
    if (typeof tag === 'string') {
      this.props.handleNewRemove(tag);
    } else {
      this.props.handleRemove(tag);
    }
  }

  removePopup() {
    this.setState({emptyBody: false});
  }

  handleOpen() {
    this.setState({open: true});
    this.props.dimmerOn();
  }

  handleClose() {
    this.setState({ open: false });
    this.props.dimmerOff();
  }

  render() {
    return (
      <Portal
          closeOnTriggerClick
          openOnTriggerClick
          trigger={(
              <Icon circular className="newPostTrigger" size="big" name="edit" />
          )}
          onOpen={() => this.handleOpen()}
          onClose={() => this.handleClose()}
          open={this.state.open}
      >
        <Segment className="newPostSegment">
          <div className="row newPostContent">
            {this.state.emptyBody ? <div className="popUpNoBody"><h4>Please type a new conversation</h4></div> : null}
            <Form className="newPostForm">
              <TextArea
                id="textarea1"
                autoHeight
                placeholder="What's on your mind?"
                minRows={2}
                onChange={(e) => this.handleChange(e)}
                onClick={() => this.removePopup()}
                />
            </Form>
          </div>
          <div className="row newPostTagsPref">
            <TagPrefContainer addTags={(tag) => (this.addTags(tag))}
                              addNewTags={(tag) => {this.addNewTags(tag);}}
                              tags={this.props.postTags}
                              newtags={this.props.newPostTags}
                              handleRemove={(tag) => this.handleRemove(tag)} />
          </div>
            <Divider />
            <div className="row newPostFooter">
              <Icon id="fileUploadNewpost" onClick={() => $('#fileInputNewpost').trigger('click')} className="attachFileIcon" name="attach" size="large" />
              <input id="fileInputNewpost" type="file" onChange={() => this.upload()} />
                {(this.state.file !== '') ?
                <input value={(this.state.newFileName !== null) ? this.state.newFileName : this.state.file.name}
                onChange={(e) => this.changeFileName(e.target.value)}/>
                  :
                  null}
                <Button className="wholeCreateButton" onClick={() => this.submitPost()} animated>
                  <Button.Content className="createButton" visible>Create</Button.Content>
                  <Button.Content className="createButton" hidden>
                    <Icon name="send" />
                  </Button.Content>
                </Button>
            </div>
        </Segment>
      </Portal>
    );
  }
}

NewPostContainer.propTypes = {
  newPost: PropTypes.func,
  newTag: PropTypes.func,
  refreshDiscover: PropTypes.func,
  lastRefresh: PropTypes.string,
  otherTags: PropTypes.array,
  postTags: PropTypes.array,
  addTag: PropTypes.func,
  handleRemove: PropTypes.func,
  clearPostTag: PropTypes.func,
  handleClose: PropTypes.func,
  toggleModal: PropTypes.func,
  useFilters: PropTypes.array,
  newPostTags: PropTypes.array,
  handleNewRemove: PropTypes.func,
  dimmerOn: PropTypes.func,
  dimmerOff: PropTypes.func
};

const mapStateToProps = (state) => ({
  lastRefresh: state.discoverReducer.lastRefresh,
  otherTags: state.discoverReducer.otherTags,
  postTags: state.postReducer.postTags,
  newPostTags: state.postReducer.newPostTags,
  useFilters: state.discoverReducer.useFilters
});

const mapDispatchToProps = (dispatch) => ({
  refreshDiscover: (posts, lastRefresh, otherTags) => dispatch({ type: 'GET_DISCOVER_DATA_REFRESH', posts: posts, lastRefresh: lastRefresh, otherTags: otherTags}),
  newPost: (postBody, postTags, newTags, lastRefresh, filter) => dispatch(newPostThunk(postBody, postTags, newTags, lastRefresh, filter)),
  newTag: (tag) => dispatch({type: 'ADD_NEW_TAG', tag: tag}),
  addTag: (tag) => dispatch({type: 'ADD_TAG', tag: tag}),
  handleRemove: (tag) => dispatch({type: 'DELETE_TAG', tag: tag}),
  handleNewRemove: (tag) => dispatch({type: 'DELETE_NEW_TAG', tag: tag}),
  clearPostTag: () => dispatch({type: 'CLEAR_POST_TAG'}),
  toggleModal: () => dispatch({type: 'MODAL_TOGGLE'}),
  dimmerOn: () => dispatch({type: 'DIMMER_ON'}),
  dimmerOff: () => dispatch({type: 'DIMMER_OFF'})
});

export default connect(mapStateToProps, mapDispatchToProps)(NewPostContainer);
