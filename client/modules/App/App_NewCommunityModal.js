
import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { Label, Input, Modal, Button, Icon } from 'semantic-ui-react';
import $ from 'jquery';
import superagent from 'superagent';
import { connect } from 'react-redux';

class NewCommunityModal extends React.Component {
  constructor() {
    super();
    this.state = {
      titleValue: '',
      image: 'https://avatars2.githubusercontent.com/u/5745754?v=4&s=88',
      otherTags: [],
      filterValue: '',
      file: '',
      pic: '',
      open: false
    };
  }


  handleChange(e) {
    this.setState({titleValue: e.target.value});
  }

  handleFilterChange(e) {
    this.setState({filterValue: e.target.value});
  }

  handleClick(e) {
    e.preventDefault();
    const copy = this.state.otherTags;
    copy.push(this.state.filterValue);
    this.setState({otherTags: copy, filterValue: ''});
  }

  handleNewComm() {
    if (this.state.file !== '' && this.state.titleValue) {
      superagent.post('/aws/upload/community')
        .field('otherTags', this.state.otherTags)
        .field('title', this.state.titleValue)
        .attach('community', this.state.file)
        .end((err, res) => {
          if (err) {
            console.log(err);
            alert('failed uploaded!');
          }
          this.props.updateUser(res.body.user);
          this.props.updateCommunities(res.body.communities);
          this.setState({ open: false, titleValue: '', otherTags: [] });
        });
    } else if (this.state.titleValue) {
      this.props.handleCreate(this.state.image, this.state.titleValue, this.state.otherTags);
      this.setState({ open: false, titleValue: '', otherTags: [] });
    }
  }

  saveImage() {
    superagent.post('/aws/upload/community')
    .attach('community', this.state.file)
    .end((err, res) => {
      if (err) {
        console.log(err);
        alert('failed uploaded!');
      }
      this.setState({pic: res.body.pictureURL, file: {}});
    });
  }

  upload() {
    const myFile = $('#fileInputNewComm').prop('files');
    this.setState({ file: myFile[0] });
  }

  render() {
    return (
        <Modal size={'small'}
               basic
               trigger={ <Button className="modalTrigger" content="Create new Community" icon="add square" labelPosition="left"
               onClick={() => this.setState({open: true})} />}
               open={this.state.open}
        >
            <Modal.Header className="modalHeader">
                Create your Community!
                <Icon className="closingIcon" name="close" onClick={() => this.setState({open: false})}/>
            </Modal.Header>
            <Modal.Content scrolling>
                {/* <img className="communityImgUpload" src={'http://www.sessionlogs.com/media/icons/defaultIcon.png'} /> */}
                    <div id="communityUploaderCreate">
                      <Icon id="fileUploadNewComm" onClick={() => $('#fileInputNewComm').trigger('click')} className="editPicButton" size="big" name="edit" />
                      <input id="fileInputNewComm" type="file" onChange={() => this.upload()} />
                    </div>
                <Input
                       className="titleInput"
                       value={this.state.titleValue}
                       label="Title"
                       onChange={(e) => {this.handleChange(e);}} />
                <div style={{marginLeft: '10px', marginBottom: '2px', marginTop: '10px'}}>
                    Add Default Topics:
                </div>
                <ul>
                    {this.state.otherTags.map((filter, idx) => <li key={idx}>#{' '}{filter}</li>)}
                </ul>
                <Input labelPosition="left"
                       type="text"
                       placeholder="Topic here..."
                       value={this.state.filterValue}
                       onChange={(e) => {this.handleFilterChange(e);}} >
                    <Label basic><Icon name="hashtag" /></Label>
                    <input />
                </Input>
                <Button className="addButton" content="Add" icon="add" onClick={(e) => {this.handleClick(e);}} />
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => this.handleNewComm(this.state.image, this.state.titleValue, this.state.otherTags)}>
                    Create
                    <Icon name="lightning" />
                </Button>
            </Modal.Actions>
        </Modal>
    );
  }
}


NewCommunityModal.propTypes = {
  handleCreate: PropTypes.func,
  updateUser: PropTypes.func,
  updateCommunities: PropTypes.func
};

const mapDispatchToProps = (dispatch) => ({
  updateUser: (user) => dispatch({ type: 'GET_USER_DATA_DONE', user}),
  updateCommunities: (communities) => dispatch({ type: 'GET_ALL_COMMUNITIES_NEW', communities})
});

export default connect(null, mapDispatchToProps)(NewCommunityModal);
