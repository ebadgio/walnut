
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import joinCommunityCodeThunk from '../../thunks/community_thunks/joinCommunityCodeThunk';
import { Button, Input, Form, Segment, Portal, Loader, Icon } from 'semantic-ui-react';
import $ from 'jquery';

class JoinCommunityCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      emptyBody: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('stats receive', nextProps);
    if (nextProps.isJoined) {
      setTimeout(() => { this.setState({ open: false }); this.props.resetJoin(); }, 3000);
    }
    if (nextProps.isJoinError) {
      console.log('error in join');
      setTimeout(() => { this.props.errorDone(); }, 5000);
    }
  }


  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ code: e.target.value });
  }

  submitCode() {
    if (this.state.code) {
      this.props.submitCode(this.state.code);
    }
  }

  findEnter() {
    $('#codeTextBox').keypress((event) => {
      if (event.which === 13) {
        if (this.state.code.length > 0) {
          this.submitCode();
          return false; // prevent duplicate submission
        }
      }
      return null;
    });
  }


  render() {
    return (
            <Portal
                closeOnTriggerClick
                openOnTriggerClick
                trigger={
                  <div className="codeTrigger">
                    <Icon name="privacy" className="buttonIcon"/>
                    Enter code to join community
                  </div>
                }
                onOpen={() => this.handleOpen()}
                onClose={() => this.handleClose()}
                open={this.state.open}
            >
            <Segment className="joinCodeSegment">
            <div className="row newPostContent">
            {this.props.isJoinError ?
              <Icon name="warning sign" className="joinErrorIcon" /> : null}

              {!this.props.isJoining && !this.props.isJoined ?
                    <div>
                      <Form className="newPostForm">
                          <Input
                              id="codeTextBox"
                              placeholder="Enter code from invite"
                              onChange={(e) => { this.handleChange(e); this.findEnter(); }}
                          />
                      </Form>
                    </div> : null}

              { this.props.isJoining ?
                      <div className="isJoiningDiv">
                        <Loader className="joinLoader" active inline="centered" />
                        <p id="verifyingText">Verifying...</p>
                      </div> : null }

              { this.props.isJoined ?
                      <div>
                        <Icon name="checkmark" className="successJoinIcon"/>
                        <p>Success, you can now check out your new community</p>
                      </div> : null }

            </div>
          </Segment>
      </Portal>
        );
  }
}

JoinCommunityCode.propTypes = {
  submitCode: PropTypes.func,
  isJoined: PropTypes.bool,
  isJoinError: PropTypes.bool,
  isJoining: PropTypes.bool,
  errorDone: PropTypes.func,
  resetJoin: PropTypes.func
};

const mapStateToProps = (state) => ({
  isJoined: state.walnutHomeReducer.joiningCodeSuccess,
  isJoinError: state.walnutHomeReducer.joiningCodeError,
  isJoining: state.walnutHomeReducer.isJoiningCode
});

const mapDispatchToProps = (dispatch) => ({
  submitCode: (code) => dispatch(joinCommunityCodeThunk(code)),
  errorDone: () => dispatch({ type: 'JOINING_CODE_ERROR_DONE' }),
  resetJoin: () => dispatch({ type: 'JOINING_CODE_END'})
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinCommunityCode);
