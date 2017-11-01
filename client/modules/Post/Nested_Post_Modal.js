import React from 'react';
import PropTypes from 'prop-types';
import Post from './Post_index';
import './Post.css';
import { Modal } from 'semantic-ui-react';


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
        <Modal basic trigger={<div className="viewPostButton">View Post</div>}>
            <Modal.Content>
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
