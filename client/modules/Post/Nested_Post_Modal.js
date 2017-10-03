import React from 'react';
import PropTypes from 'prop-types';
import Post from './Post_index';
import './Post.css';
import { Button, Modal } from 'semantic-ui-react';


class NestedPostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // startListen() {
  //   $(document).keyup((event) => {
  //     if (event.keyCode === 27) {
  //       console.log('trying to press escape testing');
  //       this.handleClose();
  //       this.props.closeModal();
  //     }
  //     return null;
  //   });
  // }

  render() {
    return (
        <Modal size={'small'} basic trigger={<div className="viewPostButton">View Post</div>}>
            <Modal.Content image scrolling className="scrollContentClass">
                <Post
                    nested
                    currentUser={this.props.currentUser}
                    postData={this.props.postData} />
            </Modal.Content>
        </Modal>
    );
  }
}
NestedPostModal.propTypes = {
  postData: PropTypes.object,
  currentUser: PropTypes.object
};

export default NestedPostModal;
