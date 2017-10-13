
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import joinCommunityCode from '../../thunks/community_thunks/joinCommunityCodeThunk';
import { Button, Input, Form, Segment, Portal } from 'semantic-ui-react';

class JoinCommunityCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      emptyBody: false
    };
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleChange(code) {
    this.setState({ code: code });
  }

  submitCode() {
    if (this.state.code) {
      this.props.submitCode(this.state.code);
    } else {
      this.setState({ emptyBody: true });
    }
  }

  removePopup() {
    this.setState({ emptyBody: false});
  }

  render() {
    return (
            <Portal
                closeOnTriggerClick
                openOnTriggerClick
                trigger={(
                    <Button className="codeTrigger" content="Enter code to join" icon="privacy" labelPosition="left" />
                )}
                onOpen={() => this.handleOpen()}
                onClose={() => this.handleClose()}
                open={this.state.open}
            >
            <Segment className="joinCodeSegment">
                    <div className="row newPostContent">
                        {this.state.emptyBody ? <div className="popUpNoBody"><h4>Please type code from invitation email</h4></div> : null}
                        <Form className="newPostForm">
                            <Input
                                id="codeTextBox"
                                placeholder="Enter code from invite"
                                onChange={(e) => this.handleChange(e.target.value)}
                                onClick={() => this.removePopup()}
                            />
                        </Form>
                        <Button className="wholeCreateButton" onClick={() => this.submitCode()}>
                            <Button.Content className="createButton" visible>submit</Button.Content>
                        </Button>
                    </div>
                </Segment>
            </Portal>
        );
  }
}

JoinCommunityCode.propTypes = {
  submitCode: PropTypes.func
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  submitCode: (code) => dispatch(joinCommunityCode(code))
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinCommunityCode);
