
import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { Modal, Button } from 'semantic-ui-react';
import CreateCommunityPage from './App_NewCommunityPage.js';

class NewCommunityModal extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  closeModal() {
    this.setState({ open: false });
  }

  render() {
    return (
        <Modal size={'small'}
               basic
               trigger={ <Button className="modalTrigger" content="Create new Community" icon="add square" labelPosition="left"
               onClick={() => this.setState({open: true})} />}
               open={this.state.open}
               className="modalComponent"
        >
        <CreateCommunityPage closeModal={() => this.closeModal()}/>
        </Modal>
    );
  }
}


NewCommunityModal.propTypes = {
};


export default NewCommunityModal;
