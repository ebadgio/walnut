
import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { Label, Input, Modal, Button, Icon, List, Menu } from 'semantic-ui-react';
import $ from 'jquery';
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
      activeItem: 'general'
    };
  }


  handleChange(e) {
    this.setState({titleValue: e.target.value});
  }


  // handleClick(e) {
  //   e.preventDefault();
  //   const copy = this.state.defaultFilters;
  //   copy.push(this.state.filterValue);
  //   this.setState({defaultFilters: copy, filterValue: ''});
  // }

  // handleUpdate() {
  //   if (this.state.titleValue && this.state.defaultFilters && this.state.admins) {
  //     const oldTags = this.state.oldFilters.filter((f) => this.state.defaultFilters.indexOf(f.name) !== -1);
  //     const newTags = this.state.defaultFilters.filter((f) => this.state.oldFilters.filter((fi) => fi.name === f).length === 0);
  //     if (this.state.file) {
  //       superagent.post('/aws/upload/communitypicture')
  //         .attach('community', this.state.file)
  //         .end((err, res) => {
  //           if (err) {
  //             console.log(err);
  //             alert('failed uploaded!');
  //           }
  //           this.props.handleUpdate(res.body.pictureURL, this.state.titleValue, oldTags, newTags, this.state.admins);
  //         });
  //     } else {
  //       this.props.handleUpdate(this.state.image, this.state.titleValue, oldTags, newTags, this.state.admins);
  //     }
  //     this.setState({open: false});
  //   }
  // }

  // upload() {
  //   const myFile = $('#fileInputEditComm').prop('files');
  //   this.setState({ file: myFile[0] });
  // }

  // handleAdmin(user) {
  //   if (this.state.admins.length > 1) {
  //     const newState = this.state.admins.filter((u) => u._id !== user._id);
  //     this.setState({admins: newState});
  //   }
  // }

  // handleAddAdminChange(value) {
  //   if (value) {
  //     const newState = this.state.admins.concat(value);
  //     this.setState({admin: ''});
  //     this.setState({admins: newState});
  //   }
  // }

  // handleRemoveTag(tag) {
  //   if (this.state.defaultFilters.length > 0) {
  //     const newState = this.state.defaultFilters.filter((t) => t !== tag);
  //     this.setState({defaultFilters: newState});
  //   }
  // }


  handleTabClick(name) {
    this.setState({ activeItem: name });
  }

  upload() {
    const myFile = $('#fileInputEditComm').prop('files');
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

  handleAdminRemove(n) {
    const copy = this.state.admins.slice();
    copy.splice(n, 1);
    this.setState({ admins: copy });
  }

  render() {
    return (
        <Modal size={'small'}
               basic
               closeIcon={<Icon className="closeEditModal" size="big" name="close" />}
               className="editCommModal"
               trigger={ <Button className="modalEditTrigger" content="Edit Community" icon="edit" labelPosition="left" />}
        >
            {/* <Modal.Header className="modalHeader">
                Edit your community!
            </Modal.Header>
            <Modal.Content scrolling>
                <img className="communityImgUpload" src={this.state.image} />
                <Icon id="fileUploadEditComm" onClick={() => $('#fileInputEditComm').trigger('click')} className="editPicButton" size="big" name="edit" />
                <input id="fileInputEditComm" type="file" onChange={() => this.upload()} />
                <Input
                       className="titleInput"
                       value={this.state.titleValue}
                       label="Title"
                       onChange={(e) => {this.handleChange(e);}} />
                <h2>Admin</h2>
                <List divided verticalAlign="middle">
                  {this.state.admins.map((user) => (
                    <List.Item>
                      <Icon name="remove" size="tiny" verticalAlign="middle" onClick={() => this.handleAdmin(user)}/>
                      <List.Content>
                        <List.Header className="adminFname">{user.fullName}</List.Header>
                      </List.Content>
                    </List.Item>
                  ))}
                </List>
                <p>Add user to admin</p>
                <Select
                  className="editCommunitySelector"
                  name="selected-state"
                  value={this.state.admin}
                  simpleValue
                  clearable
                  options={this.state.users.filter((user) => this.state.admins.map((u) => u._id).indexOf(user._id) === -1).map((user) => {
                    return {value: user, label: user.fullName};
                  })}
                  onChange={this.handleAddAdminChange.bind(this)}
                  placeholder="Search by Name"
                />
                <h2>Default Topics:</h2>
                <ul>
                    <List divided verticalAlign="middle">
                      {this.state.defaultFilters.map((filter, idx) => (
                        <List.Item key={idx}>
                          <Icon name="remove" size="tiny" verticalAlign="middle" onClick={() => this.handleRemoveTag(filter)}/>
                          <List.Content>
                            <List.Header className="adminFname">#{' '}{filter}</List.Header>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List>
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
                <Button onClick={() => this.handleUpdate()}>
                    Update
                    <Icon name="lightning" />
                </Button>
            </Modal.Actions> */}
              <div className="editCommTabs">
                <Menu fluid vertical tabular>
                  <Menu.Item name="general" active={this.state.activeItem === 'general'} onClick={() => this.handleTabClick('general')} />
                  <Menu.Item name="admins" active={this.state.activeItem === 'admins'} onClick={() => this.handleTabClick('admins')} />
                  <Menu.Item name="members" active={this.state.activeItem === 'members'} onClick={() => this.handleTabClick('members')} />
                </Menu>
              </div>

              {this.state.activeItem === 'general' ?
                <div className="editTabSection">
                  <input id="fileInputEditComm" type="file" onChange={() => this.upload()} />
                  <div className="imgWrapperComm"><img onClick={() => $('#fileInputEditComm').trigger('click')} className="communityImgUpload" src={this.state.image} /></div>
                  <Input
                    className="titleInput"
                    value={this.state.titleValue}
                    onChange={(e) => { this.handleChange(e); }} />
                </div> : null }

              {this.state.activeItem === 'admins' ?
                <div className="editTabSection">
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
                    Add new members
                  </div>
                </div> : null}

              {this.state.activeItem === 'members' ?
                <div className="editTabSection">
                  <h3>members</h3>
                </div> : null}
        </Modal>
    );
  }
}


EditCommunityModal.propTypes = {
  handleUpdate: PropTypes.func,
  handleLogoClose: PropTypes.func,
  community: PropTypes.object,
  admins: PropTypes.array
};


export default EditCommunityModal;
