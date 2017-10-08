import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { Modal, Button, Icon, Input, Label, Form, Checkbox } from 'semantic-ui-react';
import createCommunityThunk from '../../thunks/community_thunks/createCommunityThunk';
import superagent from 'superagent';
import $ from 'jquery';
import { connect } from 'react-redux';

class CreateCommunityPage extends React.Component {
  constructor() {
    super();
    this.state = {
      titleValue: '',
      image: 'https://avatars2.githubusercontent.com/u/5745754?v=4&s=88',
      otherTags: [],
      filterValue: '',
      file: '',
      pic: '',
      page: 1,
      status: 'public'
    };
  }


  handleChange(e) {
    this.setState({ titleValue: e.target.value });
  }

  handleFilterChange(e) {
    this.setState({ filterValue: e.target.value });
  }

  handleClick(e) {
    e.preventDefault();
    const copy = this.state.otherTags;
    copy.push(this.state.filterValue);
    this.setState({ otherTags: copy, filterValue: '' });
  }

  handleNewComm() {
    if (this.state.file !== '' && this.state.titleValue) {
      console.log('inside with pic', this.state.file, this.state.titleValue, this.state.status, this.state.otherTags);
      this.props.handleCreate(this.state.file, this.state.titleValue, this.state.status, this.state.otherTags);
      this.setState({ titleValue: '', status: 'public', otherTags: [] });
      this.props.closeModal();
    } else if (this.state.titleValue) {
      this.props.handleCreate(this.state.image, this.state.titleValue, this.state.status, this.state.otherTags);
      this.setState({ titleValue: '', status: 'public', otherTags: [] });
      this.props.closeModal();
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
    console.log('val val', val.value);
    this.setState({ status: val.value });
  }

  render() {
    return (
        <div className="createCommunityCard">


            { this.state.page === 1 ?
            <div>
                <Modal.Header className="modalHeader">
                    <Icon className="closingIcon" name="close" onClick={() => this.props.closeModal()} />
                </Modal.Header>
                <Modal.Content scrolling>

                    <h3 id="communityPictureText">Community Picture</h3>
                    <input id="fileInputNewComm" type="file" onChange={() => this.upload()} />
                    {this.state.file !== '' ? <div className="imgWrapperComm"><img onClick={() => $('#fileInputNewComm').trigger('click')} className="communityImgUpload" src={this.state.file} /></div> : null }
                    {this.state.file  === '' ?
                    <div id="communityUploaderCreate">
                        <Button id="fileUploadNewComm" onClick={() => $('#fileInputNewComm').trigger('click')} className="editPicButton">Upload picture</Button>
                    </div> : null }
                    {this.state.file === '' ?
                        <img className="communityImgPre" src="https://avatars2.githubusercontent.com/u/5745754?v=4&s=88" /> : null }

                    <h3 id="communityTitleText">Community Title</h3>
                    <Input
                        className="titleInput"
                        value={this.state.titleValue}
                        onChange={(e) => { this.handleChange(e); }} />
                </Modal.Content>
                <Modal.Actions className="createCommunityActions">
                        <Button.Content className="nextButtonModal1" onClick={() => this.state.titleValue === '' ? null : this.setState({page: 2})} visible>Next</Button.Content>
                </Modal.Actions>
            </div> : null }


            { this.state.page === 2 ?
            <div>
                <Modal.Header className="modalHeader">
                    <Icon className="closingIcon" name="close" onClick={() => this.props.closeModal()} />
                </Modal.Header>
                <h3 id="communityPrivacyHeader">Community Discovery Settings</h3>
                <Form className="privacySettings">
                    <div>
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
                    <div>
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
                    <div>
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
                <Modal.Actions className="createCommunityActions">
                    <Button.Content className="prevButtonModal" onClick={() => this.setState({ page: 1 })} visible>Back</Button.Content>
                    <Button.Content className="nextButtonModal" onClick={() => this.setState({page: 3})} visible>Next</Button.Content>
                </Modal.Actions>
            </div> : null }


            {this.state.page === 3 ?
                <div>
                    <Modal.Header className="modalHeader">
                        <Icon className="closingIcon" name="close" onClick={() => this.props.closeModal()} />
                    </Modal.Header>
                    <h3 className="topicTitle">Add Default Conversation Topics:</h3>
                    <h4 className="topicIntro">Topics help your community stay organised and discover conversations more efficiently</h4>
                    <img src="https://s3-us-west-1.amazonaws.com/walnut-test/topicEg.png" className="topicPicture"/>
                    <ul id="defaultTopicList">
                        {this.state.otherTags.map((filter, idx) => <li className="topicLi" key={idx}>#{' '}{filter.toUpperCase()}</li>)}
                    </ul>
                    <div className="addTags">
                        <Input
                            id="topicInput"
                            labelPosition="left"
                            type="text"
                            placeholder="Add Topic here..."
                            value={this.state.filterValue}
                            onChange={(e) => { this.handleFilterChange(e); }} >
                            <Label basic><Icon name="hashtag" /></Label>
                            <input />
                        </Input>
                        <Button className="addButton" content="Add" icon="add" onClick={(e) => { this.handleClick(e); }} />
                    </div>

                    <Modal.Actions className="createCommunityActions">
                        <Button.Content className="prevButtonModal" onClick={() => this.setState({ page: 2 })} visible>Back</Button.Content>
                        <Button.Content className="nextButtonModal" onClick={() => this.setState({page: 4})} visible>Next</Button.Content>
                    </Modal.Actions>
                </div> : null}


            {this.state.page === 4 ?
                <div>
                    <Modal.Header className="modalHeader">
                        <Icon className="closingIcon" name="close" onClick={() => this.props.closeModal()} />
                    </Modal.Header>
                    <h3 className="topicTitle">Add Members:</h3>
                    <Modal.Actions className="createCommunityActions">
                        {/* <Button onClick={() => this.handleNewComm(this.state.image, this.state.titleValue, this.state.otherTags)}>
                            Create
                            <Icon name="lightning" />
                        </Button> */}
                        <Button.Content className="createButtonModal" onClick={() => this.handleNewComm()} visible>Create <Icon name="lightning" /></Button.Content>
                        <Button.Content className="prevButtonModalEnd" onClick={() => this.setState({ page: 3 })} visible>Back</Button.Content>
                    </Modal.Actions>
                </div> : null}
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
  handleCreate: (image, title, status, otherTags) => dispatch(createCommunityThunk(image, title, status, otherTags))
});

export default connect(null, mapDispatchToProps)(CreateCommunityPage);
