import React from 'react';
import PropTypes from 'prop-types';
import './Post.css';
import { connect} from 'react-redux';
import { Icon, Modal } from 'semantic-ui-react';
import firebaseApp from '../../firebase';
import PostModalMessages from './Post_Modal_Messages.js';
import ModalTextBox from './Post_Modal_TextBox';
import ModalHeader from './Post_Modal_Header.js';
import PostModalSideBar from './Post_Modal_SideBar';

class ModalInstance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      emojiIsOpen: false
    };
  }

  componentDidMount() {
    const user = firebaseApp.auth().currentUser;
    this.setState({user: user});
  }

  render() {
    return (
      <Modal
             size={'medium'}
             basic
             open={this.props.modalOpen}
             onClose={() => this.setState({isOpen: false})}
             onUnmount={() => this.setState({isOpen: false})}
             className="postModal"
        >
        <Modal.Content className="postModalSidebar">
          <PostModalSideBar />
        </Modal.Content>
        <div className="postModalMain">
          <Modal.Header className="modalHeader">
            <ModalHeader members={this.state.members} membersCount={this.state.membersCount} postData={this.props.postData}/>
          </Modal.Header>
          <Modal.Content scrolling className="scrollContentClass" id="scrolling">
            <PostModalMessages />
          </Modal.Content>
          <Modal.Actions className="modalActions">
            <ModalTextBox members={this.state.members} postData={this.props.postData} handleChange={(e) => this.handleChange(e)} findEnter={() =>this.findEnter()} />
          </Modal.Actions>
        </div>
      </Modal>
    );
  }
}
ModalInstance.propTypes = {
  postData: PropTypes.object,
  onClick: PropTypes.func,
  currentUser: PropTypes.object,
  startListen: PropTypes.func,
  joinConversation: PropTypes.func,
  mini: PropTypes.bool,
  modalOpen: PropTypes.bool,
  closeModal: PropTypes.func
};

const mapStateToProps = (state) => ({
  modalOpen: state.modalReducer.open,
  postData: state.modalReducer.postData
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch({type: 'MAKE_CLOSED'})
});


export default connect(mapStateToProps, mapDispatchToProps)(ModalInstance);
