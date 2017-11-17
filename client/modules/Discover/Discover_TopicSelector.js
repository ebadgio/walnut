// dispatches filter preferences

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import toggleFilterCheckedThunk from '../../thunks/toggleFilterCheckedThunk';
import updateUserPrefThunk from '../../thunks/user_thunks/updateUserPrefThunk';
import toggleTempFilterCheckedThunk from '../../thunks/toggleTempFilterCheckedThunk';
import { Icon, Label, Search } from 'semantic-ui-react';
import _ from 'lodash';
class TopicSelectorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: [],
      useFilters: [],
      options: [],
      isLoadging: false,
      results: [],
      value: ''
    };
    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }
  componentDidMount() {
    if (!this.props.isFetching && this.props.otherFilters) {
      const options = this.selectOptions(this.props);
      if (options.length > 0) {
        this.setState({options: options});
      } else {
        console.log('missing options');
      }
    } else {
      console.log('that shit is missing');
    }
  }


  componentWillReceiveProps(nextProps) {
    if (!nextProps.isFetching && nextProps.otherFilters) {
      const options = this.selectOptions(nextProps);
      if (options.length > 0) {
        this.setState({options: options});
      } else {
        console.log('missing options');
      }
    } else {
      console.log('that shit is missing');
    }
  }

  resetComponent() {
    this.setState({isLoading: false, results: [], value: ''});
  }

  handleResultSelect(e, { result }) {
    const send = this.props.otherFilters.filter((filter) => filter.name === result.value);
    this.props.addFilters(send);
    this.props.toggleTempChecked(this.props.useFilters.concat(send).map((filt) => filt._id));
    this.resetComponent();
    window.scrollTo(0, 0);
  }

  selectOptions(props) {
    if(props.useFilters.length === 0) {
      return props.otherFilters.map((tag) => {
        return { value: tag.name, title: '#' + tag.name };
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
    const indxs = props.useFilters.map((filter) => findWithAttr(props.otherFilters, 'name', filter.name));
    const arrFilt = props.otherFilters.slice();
    indxs.forEach((indx) => arrFilt.splice(indx, 1));
    return arrFilt.map((tag) => {
      return {value: tag.name, title: '#' + tag.name};
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

  handleSearchChange(e, { value }) {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(this.state.options, isMatch),
      });
    }, 300);
  }

  render() {
    return (
      <div className="topicContainer">
        <div id="choice_form">
          {/* <span className="currentView">Currently viewing posts including: </span>*/}
          {this.props.useFilters.length > 0 ?
            this.props.useFilters.map((filter, index) => (
              <div key={index} className="tag">
                <text className="hashtag"># {filter.name}</text>
                <Icon className="topicRemove" name="delete" onClick={() => this.handleRemove(filter)} />
              </div>
              ))
           :
            null }
            {/* <span className="allTopics">All Topics</span>*/}
        </div>
         <Search
             className="topicSearchBar"
             loading={this.state.isLoading}
             onResultSelect={this.handleResultSelect}
             onSearchChange={this.handleSearchChange}
             results={this.state.results}
             value={this.state.value}
             icon="hashtag"
         />
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
