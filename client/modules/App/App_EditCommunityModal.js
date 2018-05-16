
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './App.css';
import { Input, Modal, Button, Icon, Menu } from 'semantic-ui-react';
import updateCommunityThunk from '../../thunks/community_thunks/updateCommunityThunk';
import superagent from 'superagent';
import Select from 'react-select';

class EditCommunityModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleValue: this.props.community.title,
      image: this.props.community.icon,
      users: this.props.community.users,
      admins: this.props.community.admins,
      admin: '',
      activeItem: 'general',
      newMembers: []
    };
  }

  handleChange(e) {
    this.setState({ titleValue: e.target.value });
  }

  handleTabClick(name) {
    this.setState({ activeItem: name });
  }

  upload(e) {
    const myFile = e.target.files;
    superagent.post('/aws/upload/communitypicture')
      .attach('community', myFile[0])
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('file end', res.body);
        this.setState({ image: res.body.pictureURL });
      });
  }

  handleAddAdminChange(value) {
    if (value) {
      const newState = this.state.admins.concat(value);
      this.setState({ admin: '' });
      this.setState({ admins: newState });
    }
  }

  handleAdminRemove(n) {
    const copy = this.state.admins.slice();
    copy.splice(n, 1);
    this.setState({ admins: copy });
  }

  handleMemberRemove(n) {
    const copy = this.state.users.slice();
    copy.splice(n, 1);
    this.setState({ users: copy });
  }

  handleMemberEmailRemove(n) {
    const copy = this.state.newMembers.slice();
    copy.splice(n, 1);
    this.setState({ newMembers: copy });
  }

  handleMemberChange(e) {
    this.setState({ member: e.target.value });
  }

  findEnterMember(event) {
    if (event.key === 'Enter') {
      this.handleMemberClick();
    }
  }

  handleMemberClick() {
    if (this.state.member.length !== 0) {
      const copy = this.state.newMembers.slice();
      copy.push(this.state.member);
      this.setState({ newMembers: copy, member: '' });
    }
  }

  handleSave() {
    this.props.handleClose();
    const users = this.state.users.map((u) => u._id);
    const admins = this.state.admins.map((u) => u._id);
    this.props.updateCommunity(this.state.titleValue, this.state.image, users, admins, this.state.newMembers, this.props.community._id);
    setTimeout(() => this.setState({ newMembers: [] }));
  }

  render() {
    return (
        <Modal size={'small'}
               basic
               className="editCommModal"
               open={this.props.openModal}
        >
        <Icon className="closeEditModal" size="big" name="close" onClick={() => this.props.handleClose()}/>

              <div className="editCommTabs">
                <Menu fluid vertical tabular>
                  <Menu.Item name="general" active={this.state.activeItem === 'general'} onClick={() => this.handleTabClick('general')} />
                  <Menu.Item name="admins" active={this.state.activeItem === 'admins'} onClick={() => this.handleTabClick('admins')} />
                  <Menu.Item name="members" active={this.state.activeItem === 'members'} onClick={() => this.handleTabClick('members')} />
                </Menu>
              </div>

              {this.state.activeItem === 'general' ?
                <div className="editTabSection">
                  <input ref={(input) => { this.fileInputEditComm = input; }} id="fileInputEditComm" type="file" onChange={(e) => this.upload(e)} />
                  <div className="imgWrapperComm"><img onClick={() => this.fileInputEditComm.click()} className="communityImgUpload" src={this.state.image} /></div>
                  <Input
                    className="titleInput"
                    value={this.state.titleValue}
                    onChange={(e) => { this.handleChange(e); }} />
                  <Button.Content className="saveButtonEditModal" onClick={() => this.handleSave()} visible>Save</Button.Content>
                </div> : null }

              {this.state.activeItem === 'admins' ?
                <div className="editTabSection">
                  <h3 className="adminCurrentTitle">Current Admins</h3>
                  <div className="currentAdmins">
                    {this.state.admins.map((admin, i) => (
                      <div className="emailInnerDiv" ref={(ref) => { this['_div' + i] = ref; }}>
                        <Icon className="removeIcon" name="close" onClick={() => this.handleAdminRemove(i)} />
                        <h4 className="email">
                          {admin.fullName}
                        </h4>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Select
                      className="editCommunitySelector"
                      name="selected-state"
                      value={this.state.admin}
                      simpleValue
                      clearable
                      options={this.state.users.filter((user) => this.state.admins.map((u) => u._id).indexOf(user._id) === -1).map((user) => {
                        return { value: user, label: user.fullName };
                      })}
                      onChange={this.handleAddAdminChange.bind(this)}
                      placeholder="Add admin by name"
                    />
                  </div>
                  <Button.Content className="saveButtonEditModal" onClick={() => this.handleSave()} visible>Save</Button.Content>
                </div> : null}

              {this.state.activeItem === 'members' ?
                <div className="editTabSection">
                  <h3 className="adminCurrentTitle">Current Members</h3>
                  <div className="currentMembers">
                    {this.state.users.map((user, i) => (
                      <div className="emailInnerDiv" ref={(ref) => { this['_div' + i] = ref; }}>
                        <Icon className="removeIcon" name="close" onClick={() => this.handleMemberRemove(i)} />
                        <h4 className="email">
                          {user.fullName}
                        </h4>
                      </div>
                    ))}
                  </div>

                  <h3 className="emailTopicTitle">Add Members</h3>
                  <div className="emailEditDiv">
                    {this.state.newMembers.map((email, i) =>
                      <div className="emailInnerDiv" ref={(ref) => { this['_div' + i] = ref; }}>
                        <Icon className="removeIcon" name="close" onClick={() => this.handleMemberEmailRemove(i)} />
                        <h4 className="email">
                          {email}
                        </h4>
                      </div>
                    )}
                  </div>
                  <div className="addTags">
                    <Input
                      id="memberInput"
                      labelPosition="left"
                      type="text"
                      placeholder="Add members by email..."
                      value={this.state.member}
                      onKeyPress={(e) => this.findEnterMember(e)}
                      onChange={(e) => { this.handleMemberChange(e); }} >
                      <input />
                    </Input>
                  </div>
                  <Button.Content className="saveButtonEditModal" onClick={() => this.handleSave()} visible>Save</Button.Content>
                </div> : null}
        </Modal>
    );
  }
}


EditCommunityModal.propTypes = {
  community: PropTypes.object,
  updateCommunity: PropTypes.func,
  handleClose: PropTypes.func,
  openModal: PropTypes.bool
};

const mapDispatchToProps = (dispatch) => ({
  updateCommunity: (title, image, users, admins, newMembers, id) => dispatch(updateCommunityThunk(title, image, users, admins, newMembers, id))
});

export default connect(null, mapDispatchToProps)(EditCommunityModal);
