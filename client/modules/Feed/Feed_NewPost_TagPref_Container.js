// dispatches filter preferences

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Creatable } from 'react-select';
import { Icon, Button, Label } from 'semantic-ui-react';
import newTagThunk from '../../thunks/post_thunks/newTagThunk';

// TODO Filter component box style
// TODO button onClick dispatches toggleChecked(index) 17

class TagPref extends React.Component {
  constructor() {
    super();
    this.state = {
      value: []
    };
  }

  handleSelectChange(value) {
    // if (value.trim().length > 0) {
    this.setState({value});
    // }
  }

  handleNew(event) {
    event.preventDefault();
    console.log('this.state.value', this.state.value);
    // make sure not to have empty strings
    if (this.state.value.length > 0) {
      const options = this.state.value.map((obj) => {return obj.value.replace(/\W/g, '');});
      // const options = this.state.value.split(',');
      // send is an array that only includes the objects that are being added
      const send = this.props.otherFilters.filter((filter) => (options.indexOf(filter.name) > -1));
      console.log('here', send);
      if (send.length === 0) {
        this.props.newTagThunk(options);
      }
      this.props.addTags(send);
      this.setState({value: []});
    }
  }

  handleChange(e) {
    this.props.addNewTags(e.target.value);
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    console.log('all of the tags here');
    console.log(this.props.defaultFilters);
    console.log(this.props.tempTags);
    console.log(this.props.newTags);
    console.log(this.props.tags);
    return (
      <div>
        {/* <form name="choice_form" id="choice_form" method="post" onSubmit={this.handleSubmit}>
          {this.props.defaultFilters.map((filter, index) => (
            <div key={index} className="choiceForm">
              <input type="checkbox" id={filter.name}
                checked={(this.props.tags.includes(filter._id)) ? 'checked' : ''}
                value={filter._id}
                onClick={(e) => {this.handleChange(e);}}
              />
              <label id="tag" htmlFor={filter.name}># {filter.name}</label>
            </div>
            ))}
            {this.props.tempTags.map((tag, idx) => (
            <div key={idx} className="choiceForm">
                  <input type="checkbox"
                         id={tag.name}
                         checked={(this.props.tags.includes(tag._id)) ? 'checked' : ''}
                         value={tag._id}
                         onClick={(e) => {this.handleChange(e);}}
                  />
                  <label id="tag" htmlFor={tag.name}># {tag.name}</label>
                </div>
            ))}
            {this.props.newTags.map((tag, idx) => (
            <div key={idx} className="choiceForm">
                  <input type="checkbox"
                         id={tag.name}
                         checked={(this.props.tags.includes(tag._id)) ? 'checked' : ''}
                         value={tag._id}
                         onClick={(e) => {this.handleChange(e);}}
                  />
                  <label id="tag" htmlFor={tag.name}># {tag.name}</label>
                </div>
            ))}
        </form> */}
        {this.props.tags ?
          this.props.tags.map((filter, index) => (
                <p key={index}>
                  <Label image>
                    # {filter.name}
                    <Icon name="delete" onClick={() => this.handleRemove(filter)} />
                  </Label>
                </p>
              )) :
          null
        }
        <form onSubmit={(e) => this.handleNew(e)} id="addingTags">
          <Creatable
              className="searchTags"
              name="form-field-name"
              multi
              clearable
              placeholder="Select Tag or Type your own..."
              value={this.state.value}
              options={this.props.otherFilters.map((tag) => {
                return {value: tag.name, label: '#' + tag.name};
              })}
              onChange={this.handleSelectChange.bind(this)}
          />
          <Button animated="vertical" id="addTagButton">
            <Button.Content visible>Add</Button.Content>
            <Button.Content hidden>
              <Icon name="hashtag" />
            </Button.Content>
          </Button>
        </form>
      </div>
    );
  }
}

TagPref.propTypes = {
  defaultFilters: PropTypes.array,
  otherFilters: PropTypes.array,
  addTags: PropTypes.func,
  tags: PropTypes.array,
  addTempTags: PropTypes.func,
  tempTags: PropTypes.array,
  newTags: PropTypes.array,
  newTagThunk: PropTypes.func
};

const mapStateToProps = (state) => ({
  otherFilters: state.discoverReducer.otherFilters,
  newTags: state.newTagsReducer
});

const mapDispatchToProps = (dispatch) => ({
  newTagThunk: (tag) => dispatch(newTagThunk(tag))
});

export default connect(mapStateToProps, mapDispatchToProps)(TagPref);


 // style={{float: 'left', clear: 'both', padding: '5%', paddingTop: '40'}}
