import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { Icon, Input, Label, Form, Checkbox } from 'semantic-ui-react';
import createCommunityThunk from '../../thunks/community_thunks/createCommunityThunk';
import superagent from 'superagent';
import $ from 'jquery';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import {history} from '../Auth/Auth_index';

class CreateCommunityPage extends React.Component {
  constructor() {
    super();
    this.state = {
      titleValue: '',
      image: 'https://avatars2.githubusercontent.com/u/5745754?v=4&s=88',
      otherTags: [],
      filterValue: '',
      newMembers: [],
      member: '',
      file: '',
      pic: '',
      page: 1,
      status: 'public',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // Scroll to bottom
    if (prevState.newMembers.length !== this.state.newMembers.length) {
      const len = this.state.newMembers.length - 1;
      const node = ReactDOM.findDOMNode(this['_div' + len]);
      if (node) {
        node.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  handleChange(e) {
    this.setState({ titleValue: e.target.value });
  }

  handleFilterChange(e) {
    this.setState({ filterValue: e.target.value });
  }

  handleClickTag() {
    if (this.state.filterValue.length !== 0 ) {
      const copy = this.state.otherTags;
      copy.push(this.state.filterValue);
      this.setState({ otherTags: copy, filterValue: '' });
    }
  }

  handleMemberChange(e) {
    this.setState({ member: e.target.value });
  }

  handleMemberClick() {
    if (this.state.member.length !== 0) {
      const copy = this.state.newMembers.slice();
      copy.push(this.state.member);
      this.setState({ newMembers: copy, member: '' });
    }
  }

  handleMemberRemove(n) {
    const copy = this.state.newMembers.slice();
    copy.splice(n, 1);
    this.setState({ newMembers: copy});
  }

  handleTagRemove(n) {
    const copy = this.state.otherTags.slice();
    copy.splice(n, 1);
    this.setState({ otherTags: copy });
  }

  handleNewComm() {
    if (this.state.file !== '' && this.state.titleValue) {
      this.props.handleCreate(this.state.file, this.state.titleValue, this.state.status, this.state.otherTags, this.state.newMembers);
      this.setState({ titleValue: '', status: 'public', otherTags: [], displaySuccess: true });
      setTimeout(() => history.replace('/walnuthome'), 1500);
    } else if (this.state.titleValue) {
      this.props.handleCreate(this.state.image, this.state.titleValue, this.state.status, this.state.otherTags, this.state.newMembers);
      this.setState({ titleValue: '', status: 'public', otherTags: [], displaySuccess: true  });
      setTimeout(() => history.replace('/walnuthome'), 1500);
    }
  }

  upload() {
    const myFile = $('#fileInputNewComm').prop('files');
    superagent.post('/aws/upload/communitypicture')
    .attach('community', myFile[0])
    .end((err, res) => {
      if (err) {
        console.log(err);
      }
      console.log('file end', res.body);
      this.setState({ file: res.body.pictureURL });
    });
  }

  handleRadio(e, val) {
    this.setState({ status: val.value });
  }

  findEnterMember() {
    $('#memberInput').keypress((event) => {
      if (event.which === 13) {
        this.handleMemberClick();
        return false; // prevent duplicate submission
      }
      return null;
    });
  }

  findEnterTag() {
    $('#topicInput').keypress((event) => {
      if (event.which === 13) {
        this.handleClickTag();
        return false; // prevent duplicate submission
      }
      return null;
    });
  }


  render() {
    if (this.state.displaySuccess) {
      setTimeout(() => this.setState({animate: true}), 100);
      setTimeout(() => this.setState({animate1: true}), 200);
      setTimeout(() => this.setState({animate2: true}), 300);
      setTimeout(() => this.setState({animate3: true}), 400);
      setTimeout(() => this.setState({animate4: true}), 500);
      setTimeout(() => this.setState({animate5: true}), 600);
      return (
          <div className="success-cont">
            <div style={{display: 'flex'}}>
              <div className="success-circle" style={this.state.animate ? {background: '#673AB7', marginTop: '-30px'} : {marginTop: '-30px'}}></div>
              <div className="success-circle" style={this.state.animate1 ? {background: '#3F51B5', marginLeft: '30px', marginRight: '30px'} : {marginLeft: '30px', marginRight: '30px'}}></div>
              <div className="success-circle" style={this.state.animate2 ? {background: '#2196F3'} : {}}></div>
            </div>
            <div className="success-message">
              Your community has been created!
            </div>
            <div style={{display: 'flex'}}>
              <div className="success-circle" style={this.state.animate3 ? {background: '#FFC107'} : {}}></div>
              <div className="success-circle" style={this.state.animate4 ? {background: '#FF9800', marginLeft: '30px', marginRight: '30px'} : {marginLeft: '30px', marginRight: '30px'}}></div>
              <div className="success-circle" style={this.state.animate5 ? {background: '#FF5722', marginBottom: '30px'} : {marginBottom: '30px'}}></div>
            </div>
          </div>
      );
    } else if (this.state.page === 1) {
      return (
          <div>
            <div className="nameCont">
              <span className="create-titles">
                Step 1a: Name this Community
              </span>
              <input className="login_inputs"
                     placeholder="Name here"
                     style={{marginBottom: '10px'}}
                     type="text"
                     value={this.state.titleValue}
                     onChange={(e) => this.handleChange(e)}
                     name="title" />
            </div>
            <div className="imgUploadCont">
              <span className="create-titles">
                Step 1b: Give it an avatar
              </span>
              <input id="fileInputNewComm" type="file" onChange={() => this.upload()} />
                {this.state.file !== '' ?
                  <img onClick={() => $('#fileInputNewComm').trigger('click')} className="communityImgPre" src={this.state.file} /> : null }
              {this.state.file === '' ?
                  <img className="communityImgPre" src="https://avatars2.githubusercontent.com/u/5745754?v=4&s=88" /> : null }
              {this.state.file  === '' ?
                    <div id="communityUploaderCreate">
                      <div id="fileUploadNewComm" onClick={() => $('#fileInputNewComm').trigger('click')}>Upload picture</div>
                    </div> : null }
            </div>
            <div className="step-container">
              <div style={{width: '90px', height: '40px'}}></div>
              <div style={{display: 'flex'}}>
                <div className="step-circle" style={{background: '#2196F3', opacity: '1'}}></div>
                <div className="step-circle" style={{background: '#FFC107'}}></div>
                <div className="step-circle" style={{background: '#FF9800'}}></div>
                <div className="step-circle" style={{background: '#FF5722'}}></div>
              </div>
              <div className="next-button"
                   onClick={() => this.state.titleValue === '' ? null : this.setState({page: 2})}>
                Next
              </div>
            </div>
          </div>
      );
    } else if (this.state.page === 2) {
      return (
          <div>
            <div style={{paddingTop: '10px'}}>
              <span className="create-titles">Step 2: Set your Community's Privacy Status</span>
            </div>
            <Form className="privacySettings">
              <div className="choiceBlock">
                <Form.Field>
                  <Checkbox
                      radio
                      id="radioLabel"
                      label="Public"
                      name="checkboxRadioGroup"
                      value="public"
                      checked={this.state.status === 'public'}
                      onChange={(e, val) => this.handleRadio(e, val)}
                  />
                </Form.Field>
                <p className="privacySettingDesc">Community will be open and visible to the public and can be joined by anyone</p>
              </div>
              <div className="choiceBlock">
                <Form.Field>
                  <Checkbox
                      radio
                      id="radioLabel"
                      label="Private"
                      name="checkboxRadioGroup"
                      value="private"
                      checked={this.state.status === 'private'}
                      onChange={(e, val) => this.handleRadio(e, val)}
                  />
                </Form.Field>
                <p className="privacySettingDesc">Community will be visible to the public but can only be joined by invitation or request</p>
              </div>
              <div className="choiceBlock">
                <Form.Field>
                  <Checkbox
                      radio
                      id="radioLabel"
                      label="Secret"
                      name="checkboxRadioGroup"
                      value="secret"
                      checked={this.state.status === 'secret'}
                      onChange={(e, val) => this.handleRadio(e, val)}
                  />
                </Form.Field>
                <p className="privacySettingDesc">Community will be hidden from the public and only be joined by invite</p>
              </div>
            </Form>
            <div className="step-container">
              <div className="prev-button" onClick={() => this.setState({ page: 1 })} >Back</div>
              <div style={{display: 'flex'}}>
                <div className="step-circle" style={{background: '#2196F3', opacity: '1'}}></div>
                <div className="step-circle" style={{background: '#FFC107', opacity: '1'}}></div>
                <div className="step-circle" style={{background: '#FF9800'}}></div>
                <div className="step-circle" style={{background: '#FF5722'}}></div>
              </div>
              <div className="next-button" onClick={() => this.setState({page: 3})} >Next</div>
            </div>
          </div>
      );
    } else if (this.state.page === 3) {
      return (
        <div>
          <div style={{paddingTop: '10px'}}>
            <span className="create-titles">Step 2: Add Default Conversation Topics</span>
          </div>
          <h4 className="topicIntro">Topics help your community stay organised and discover conversations more efficiently.
            Add a few topics that you think are relevant to your community.</h4>
          <div className="tagsDiv">
              { this.state.otherTags.map((tag, i) =>
                  <div className="emailInnerDiv" ref={(ref) => {this['_div' + i] = ref;}}>
                    <Icon className="removeIcon" name="close" onClick={() => this.handleTagRemove(i)} />
                    <h4 className="email">
                      # {tag.toString().toUpperCase()}
                    </h4>
                  </div>
              )}
          </div>
          <div className="addTags">
            <Input
                id="topicInput"
                labelPosition="left"
                type="text"
                placeholder="Add Topic here..."
                value={this.state.filterValue}
                onChange={(e) => { this.handleFilterChange(e); this.findEnterTag(e); }} >
              <Label basic><Icon name="hashtag" /></Label>
              <input />
            </Input>
          </div>
          <div className="step-container">
            <div className="prev-button" onClick={() => this.setState({ page: 2 })} >Back</div>
            <div style={{display: 'flex'}}>
              <div className="step-circle" style={{background: '#2196F3', opacity: '1'}}></div>
              <div className="step-circle" style={{background: '#FFC107', opacity: '1'}}></div>
              <div className="step-circle" style={{background: '#FF9800', opacity: '1'}}></div>
              <div className="step-circle" style={{background: '#FF5722'}}></div>
            </div>
            <div className="next-button" onClick={() => this.setState({page: 4})} >Next</div>
          </div>
        </div>
      );
    } else if (this.state.page === 4) {
      return (
          <div>
            <div style={{paddingTop: '10px'}}>
              <span className="create-titles">Step 4: Add Members</span>
            </div>
            <div className="topicIntro">Send some email invites to your community members! Don't worry, you can invite them later too.</div>
            <div className="emailDiv">
                { this.state.newMembers.map((email, i) =>
                    <div className="emailInnerDiv" ref={(ref) => {this['_div' + i] = ref;}}>
                      <Icon className="removeIcon" name="close" onClick={() => this.handleMemberRemove(i)} />
                      <h4 className="email">
                          {email}
                      </h4>
                    </div>
                )}
            </div>
            <div style={{marginBottom: '80px', marginLeft: '40px'}} className="addTags">
              <Input
                  id="memberInput"
                  labelPosition="left"
                  type="text"
                  placeholder="Add members by email..."
                  value={this.state.member}
                  onChange={(e) => { this.handleMemberChange(e); this.findEnterMember(e); }} >
                <input />
              </Input>
            </div>
            <div className="step-container">
              <div className="prev-button" onClick={() => this.setState({ page: 3 })} >Back</div>
              <div style={{display: 'flex'}}>
                <div className="step-circle" style={{background: '#2196F3', opacity: '1'}}></div>
                <div className="step-circle" style={{background: '#FFC107', opacity: '1'}}></div>
                <div className="step-circle" style={{background: '#FF9800', opacity: '1'}}></div>
                <div className="step-circle" style={{background: '#FF5722', opacity: '1'}}></div>
              </div>
              <div className="next-button" onClick={() => this.handleNewComm()}>Create</div>
            </div>
          </div>
      );
    }
    return (
        <div>
        </div>
    );
  }
}


CreateCommunityPage.propTypes = {
  handleCreate: PropTypes.func,
  updateUser: PropTypes.func,
  updateCommunities: PropTypes.func,
  closeModal: PropTypes.func
};

const mapDispatchToProps = (dispatch) => ({
  updateUser: (user) => dispatch({ type: 'GET_USER_DATA_DONE', user }),
  updateCommunities: (communities) => dispatch({ type: 'GET_ALL_COMMUNITIES_NEW', communities }),
  handleCreate: (image, title, status, otherTags, newMembers) => dispatch(createCommunityThunk(image, title, status, otherTags, newMembers))
});

export default connect(null, mapDispatchToProps)(CreateCommunityPage);
