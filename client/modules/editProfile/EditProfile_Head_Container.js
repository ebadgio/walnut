import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const styles = {
  head: {
    backgroundColor: 'lightblue',
    marginLeft: '100px',
    width: '65%'
  }
};
class HeadContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      blurbInput: '',
      editTags: false,
      editBlurb: false
    };
    this.handleChangeBlurb = this.handleChangeBlurb.bind(this);
    this.handleChangeTag = this.handleChangeTag.bind(this);
    this.onSubmitBlurb = this.onSubmitBlurb.bind(this);
    this.toggleTags = this.toggleTags.bind(this);
    this.addTag = this.addTag.bind(this);
    this.saveTags = this.saveTags.bind(this);
    this.removeTag = this.removeTag.bind(this);
  }
  // ComponentDidMount() {
  //   this.props.getUser();
  //   console.log('edit mount');
  // }
  handleChangeBlurb(event) {
    const input = event.target.value;
    this.setState({
      blurbInput: input,
    });
  }
  handleChangeTag(event) {
    const input = event.target.value;
    this.setState({
      tagInput: input,
    });
  }
  toggleBlurb() {
    this.setState({editBlurb: true});
  }
  onSubmitBlurb() {
    console.log('blurb', this.state.blurbInput);
    this.setState({editBlurb: false});
    // this.props.saveBlurb(this.state.blurbInput);
  }
  toggleTags() {
    this.setState({editTags: true, newTags: this.props.tags});
  }
  addTag(tag) {
    const tags = this.state.newTags;
    tags.push(tag);
    this.setState({newTags: tags, tagInput: ''});
  }
  removeTag(tag) {
    const tags = this.state.newTags;
    tags.splice(tags.indexOf(tag), 1);
    this.setState({newTags: tags});
  }
  saveTags(tags) {
    console.log('tags', tags);
    this.setState({editTags: false});
    this.props.saveTags(tags);
  }
  render() {
    console.log('hello', this.props);
    return (
      <div style={styles.head}>
          <div>
            <div style={{height: '200px', width: '150px', backgroundColor: 'blue'}}>X</div>
            <button value="Change your Profile Picture" onClick={() => {}}>Change your Profile picture</button>
          </div>
        <h1>{this.props.fullName}</h1>
        <div>
          {this.state.editTags ?
              this.state.newTags.map((tag, idx)=> <div key={idx}>
                <p>#{' '}{tag}</p>
                <button value="X" onClick={() => {this.removeTag(tag);}}>X</button>
              </div>) :
              this.props.tags.map((tag, idx) => <p key={idx}>#{' '}{tag}</p>)}
          {this.state.editTags ? <div>
              <input type="text"
                     placeholder="Your new tag"
                     value={this.state.tagInput}
                     onChange={(e) => this.handleChangeTag(e)} />
            <button value="+" onClick={() => this.addTag(this.state.tagInput)}>+</button>
          </div>
              : null }
            {this.state.editTags ?
                <button onClick={() => this.saveTags(this.state.newTags)}>Save Tags</button> :
                <button value="Edit Tags" onClick={() => this.toggleTags()}>Edit Tags</button> }
        </div>
        {this.state.editBlurb ? <div>
          <input type="text"
                 placeholder="Enter blurb here"
                 value={this.state.blurbInput ? this.state.blurbInput : this.props.blurb}
                 onChange={(e) => this.handleChangeBlurb(e)}/>
          <button onClick={() => {this.onSubmitBlurb(this.state.blurbInput);}}>Save Blurb</button>
        </div> :
            <div>
              <p>{!!this.state.blurbInput ? this.state.blurbInput : this.props.blurb}</p>
          <button onClick={() => {this.toggleBlurb();}}>Edit Blurb</button></div> }
      </div>
    );
  }
}

HeadContainer.propTypes = {
  tags: PropTypes.array,
  blurb: PropTypes.string,
  fullName: PropTypes.string,
  saveBlurb: PropTypes.func,
  saveTags: PropTypes.func,
  // getUser: PropTypes.func
};

const mapStateToProps = (state) => ({
  blurb: state.userReducer.blurb,
  tags: state.userReducer.tags,
  fullName: state.userReducer.fullName
});

const mapDispatchToProps = (dispatch) => ({
  saveBlurb: (blurb) => dispatch({type: 'SAVE_BLURB', blurb: blurb}),
  saveTags: (tags) => dispatch({type: 'SAVE_TAGS', tags: tags}),
  // getUser: () => dispatch({type: 'GET_USER_DATA'})
});

export default connect(mapStateToProps, mapDispatchToProps)(HeadContainer);