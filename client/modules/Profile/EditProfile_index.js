import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Image, Dropdown, Form, Input, Icon, Divider } from 'semantic-ui-react';
import PlacesAutocomplete from 'react-places-autocomplete';
import saveAboutThunk from '../../thunks/profile_thunks/saveAboutThunk';
import './EditProfile.css';
import superagent from 'superagent';
import $ from 'jquery';

const options = [{text: 2010, value: 2010}, {text: 2011, value: 2011}, {text: 2012, value: 2012},
    {text: 2013, value: 2013}, {text: 2014, value: 2014}, {text: 2015, value: 2015},
    {text: 2016, value: 2016}, {text: 2017, value: 2017}, {text: 2018, value: 2018},
    {text: 2019, value: 2019}, {text: 2020, value: 2020}, {text: 2021, value: 2021},
    {text: 2022, value: 2022}, {text: 2023, value: 2023}, {text: 2024, value: 2024}];

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homeTown: props.homeTown,
      school: props.school,
      concentration: props.concentration ? props.concentration[0] : '',
      graduation: props.graduation,
      position: props.position,
      company: props.company,
      location: props.location,
      saved: false,
      file: '',
      pic: ''
    };
    this.handleChangeLocation = (location) => this.setState({location});
    this.handleChangeHome = (location) => this.setState({homeTown: location});
  }

  componentDidMount() {
    this.setState({saved: false});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.saveAbout({
      colleges: [{
        name: this.state.school,
        endedAt: this.state.graduation,
        concentrations: [this.state.concentration],
      }],
      works: [{
        company: this.state.company,
        position: this.state.position,
        location: this.state.location
      }],
      places: {
        current: this.state.homeTown
      }
    });
  }

  handleChangeSchool(e) {
    this.setState({school: e.target.value});
  }

  handleChangeConcentration(e) {
    this.setState({concentration: e.target.value});
  }

  handleChangeGraduation(e, props) {
    this.setState({graduation: props.value});
  }

  handleChangePosition(e) {
    this.setState({position: e.target.value});
  }

  handleChangeCompany(e) {
    this.setState({company: e.target.value});
  }

  upload() {
    const myFile = $('#fileInputEditprofile').prop('files');
    this.setState({ file: myFile[0] });
  }

  saveImage() {
    superagent.post('/aws/upload/profile')
          .attach('profile', this.state.file)
          .end((err, res) => {
            if (err) {
              console.log(err);
              alert('failed uploaded!');
            }
            this.setState({ file: ''});
            this.props.refreshUrl({ user: res.body.url});
          });
  }

  render() {
    const inputPropsHome = {
      value: this.state.homeTown,
      onChange: this.handleChangeHome,
      placeholder: 'ex. Boston'
    };
    const inputProps = {
      value: this.state.location,
      onChange: this.handleChangeLocation,
      placeholder: 'ex. Mountain View'
    };
    return (
        <div className="editPage">
            <div className="editCard">
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    {/* insert profile pic here */}
                    <div className="infoOuter">
                      <div className="leftInfo">
                        <h4>Location</h4>
                        <Divider />
                        <div className="field">
                                <label className="editCardLabel">Hometown</label>
                                <PlacesAutocomplete inputProps={inputPropsHome} onSelect={this.handleChangeHome} />
                            </div>
                        {/* education section */}
                        <h4>Education</h4>
                        <Divider />
                            <div className="field">
                                <label className="editCardLabel">Current School (or most recent if graduated)</label>
                                <Input name="College"
                                       placeholder="ex. University of Pennsylvania"
                                       value={this.state.school}
                                       onChange={this.handleChangeSchool.bind(this)}/>
                            </div>
                            <div className="field">
                                <div className="fields">
                                <div className="ten wide field">
                                    <label className="editCardLabel">Concentration</label>
                                    <Input name="Concentration"
                                           placeholder="ex. Computer Science"
                                           value={this.state.concentration}
                                           onChange={this.handleChangeConcentration.bind(this)}/>
                                </div>
                                <div className="six wide field">
                                    <label className="editCardLabel">Graduation Year</label>
                                    {/* <input type="text" name="Graduation" placeholder="ex. 2020"
                                    onChange={this.handleChangeGraduation.bind(this)}/> */}
                                    {/* <YearSelect year={'2000'} handleSelect={this.handleChangeGraduation.bind(this)} /> */}
                                    <Dropdown id="graduation" placeholder={this.state.graduation ? this.state.graduation : 'ex. 2020'} fluid selection onChange={this.handleChangeGraduation.bind(this)}
                                    options={options}/>
                                </div>
                                </div>
                            </div>
                      </div>
                      <div className="rightInfo">
                          <h4>Occupation</h4>
                          <Divider />
                          <div className="field">
                              <label className="editCardLabel">Position</label>
                              <Input type="text" name="Position" placeholder="ex. Software Engineer"
                              value={this.state.position}
                              onChange={this.handleChangePosition.bind(this)}/>
                          </div>
                          <div className="field">
                              <label className="editCardLabel">Company</label>
                              <input type="text" name="Company" placeholder="ex. Google"
                              value={this.state.company}
                              onChange={this.handleChangeCompany.bind(this)}/>
                          </div>
                          <div className="field">
                              <label className="editCardLabel">Location</label>
                              <PlacesAutocomplete inputProps={inputProps} onSelect={this.handleChangeLocation} />
                          </div>
                         <span>
                           <Button className="saveButton" type="submit" onClick={() => this.setState({ saved: true })}>Save</Button>
                           {this.state.saved ?
                             <div style={{ color: 'black' }}>Your changes have been saved!</div>
                             : null}
                         </span>
                      </div>
                    </div>
                </Form>
            </div>
            <div className="editProfilePic">
                <div className="profilePicBox">
                   <img src={this.props.profilePic} className="proPic" />
                </div>
                <Icon id="fileUploadEditprofile" onClick={() => $('#fileInputEditprofile').trigger('click')} className="editPicButton" size="big" name="edit"  />
                <input id="fileInputEditprofile" type="file" onChange={() => this.upload()} />
                {this.state.file ? <Button className="uploadButton" onClick={() => { this.saveImage(); }}>Upload</Button> : <p></p>}
            </div>
        </div>
      );
  }
}


EditProfile.propTypes = {
  school: PropTypes.string,
  homeTown: PropTypes.string,
  concentration: PropTypes.string,
  graduation: PropTypes.string,
  position: PropTypes.string,
  company: PropTypes.string,
  saveAbout: PropTypes.func,
  location: PropTypes.string,
  profilePic: PropTypes.string,
  refreshUrl: PropTypes.func,
  fullName: PropTypes.string,
  contact: PropTypes.object
};

const mapStateToProps = (state) => ({
  homeTown: state.userReducer.placesLived.current,
  school: state.userReducer.education.colleges[0] ? state.userReducer.education.colleges[0].name : '',
  concentration: state.userReducer.education.colleges[0] ?
        state.userReducer.education.colleges[0].concentrations
        : '',
  graduation: state.userReducer.education.colleges[0] ? state.userReducer.education.colleges[0].endedAt : '',
  position: state.userReducer.work[0] ? state.userReducer.work[0].position : '',
  company: state.userReducer.work[0] ? state.userReducer.work[0].company : '',
  location: state.userReducer.work[0] ? state.userReducer.work[0].location : '',
  profilePic: state.userReducer.pictureURL,
  fullName: state.userReducer.fullName,
  contact: state.userReducer.contact
});

const mapDispatchToProps = (dispatch) => ({
  saveAbout: (about) => saveAboutThunk(about)(dispatch),
  refreshUrl: (url) => dispatch({ type: 'GET_USER_PIC', url: url})
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
