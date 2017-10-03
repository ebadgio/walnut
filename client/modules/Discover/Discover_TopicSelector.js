// dispatches filter preferences

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import toggleFilterCheckedThunk from '../../thunks/toggleFilterCheckedThunk';
import updateUserPrefThunk from '../../thunks/user_thunks/updateUserPrefThunk';
import toggleTempFilterCheckedThunk from '../../thunks/toggleTempFilterCheckedThunk';
import { Icon, Label, Search } from 'semantic-ui-react';
import $ from 'jquery';

class TopicSelectorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: [],
      value: [],
      useFilters: []
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
    // this.handleResultSelect = this.handleResultSelect.bind(this);
    // this.handleSearchChange = this.handleSearchChange.bind(this);
  }


  resetComponent() {
    this.setState({isLoading: false, results: [], value: ''});
  }

  isPrefSelected(options) {
    let val = false;
    if (this.state.useFilters.length > 0) {
      this.state.useFilters.forEach((filter) => {
        if (options.indexOf(filter.name) > -1) {
          val = true;
        }
      });
    }
    return val;
  }

  handleSelectChange(e, { value }) {
    // const newPostBox = document.getElementById('newPostBox');
    // newPostBox.scrollIntoView(true);
    e.preventDefault();
    const elem = document.getElementById('dropdownTopic');
    const send = this.props.otherFilters.filter((filter) => filter.name === value);
    this.props.addFilters(send);
    this.props.toggleTempChecked(this.props.useFilters.concat(send).map((filt) => filt._id));
    window.scrollTo(0, 0);
  }

  selectOptions() {
    if(this.props.isFetching) {
      return null;
    }
    if(!this.props.otherFilters) {
      return null;
    }
    if(this.props.useFilters.length === 0) {
      return this.props.otherFilters.map((tag) => {
        return { value: tag.name, label: '#' + tag.name };
      });
    }
    function findWithAttr(array, attr, value) {
      for (let i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }
      return -1;
    }
    const indxs = this.props.useFilters.map((filter) => findWithAttr(this.props.otherFilters, 'name', filter.name));
    const arrFilt = this.props.otherFilters.slice();
    indxs.forEach((indx) => arrFilt.splice(indx, 1));
    return arrFilt.map((tag) => {
      return {value: tag.name, label: '#' + tag.name};
    });
  }

  handleRemove(filter) {
    const newState = this.props.useFilters.filter((f) => filter.name !== f.name);
    this.props.handleRemove(newState);
    this.props.toggleTempChecked(newState.map((filt) => filt._id));
    // const newPostBox = document.getElementById('newPostBox');
    // newPostBox.scrollIntoView(true);
    window.scrollTo(0, 0);
    // this.props.toggleChecked(filter._id);
  }

  render() {
    const options = this.selectOptions();
    return (
      <div className="topicContainer">
        <div id="choice_form">
          <span className="currentView">Currently viewing posts including: </span>
          {this.props.useFilters.length > 0 ?
            this.props.useFilters.map((filter, index) => (
              <div key={index} className="tag">
                <text className="hashtag"># {filter.name}</text>
                <Icon className="topicRemove" name="delete" onClick={() => this.handleRemove(filter)} />
              </div>
              ))
           :
            <span className="allTopics">All Topics</span>
          }
        </div>
        {/* <Search*/}
            {/* loading={this.state.isLoading}*/}
            {/* onResultSelect={this.handleResultSelect}*/}
            {/* onSearchChange={this.handleSearchChange}*/}
            {/* results={this.state.results}*/}
            {/* value={this.state.value}*/}
        {/* />*/}
      </div>
    );
  }
}

TopicSelectorContainer.propTypes = {
  otherFilters: PropTypes.array,
  communityPreference: PropTypes.array,
  toggleChecked: PropTypes.func,
  getDiscoverData: PropTypes.func,
  updateUser: PropTypes.func,
  filterChange: PropTypes.func,
  toggleTempChecked: PropTypes.func,
  isFetching: PropTypes.bool,
  addFilters: PropTypes.func,
  useFilters: PropTypes.array,
  handleRemove: PropTypes.func
};

const mapStateToProps = (state) => ({
  otherFilters: state.discoverReducer.otherFilters,
  isFetching: state.discoverReducer.isFetching,
  communityPreference: state.userReducer.communityPreference,
  useFilters: state.discoverReducer.useFilters
});

const mapDispatchToProps = (dispatch) => ({
  toggleChecked: (id) => dispatch(toggleFilterCheckedThunk(id)),
  toggleTempChecked: (useFilters) => dispatch(toggleTempFilterCheckedThunk(useFilters)),
  updateUser: (updateObj) => updateUserPrefThunk(updateObj)(dispatch),
  addFilters: (send) => dispatch({type: 'ADD_FILTERS', tags: send}),
  handleRemove: (tags) => dispatch({type: 'REMOVE_FILTER', tags: tags})
});

export default connect(mapStateToProps, mapDispatchToProps)(TopicSelectorContainer);
