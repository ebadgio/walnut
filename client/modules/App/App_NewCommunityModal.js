
import React from 'react';
import './App.css';
import { Modal, Icon } from 'semantic-ui-react';
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
               trigger={
                 <div className="modalTrigger" onClick={() => this.setState({open: true})}>
                   <Icon name="plus" className="buttonIconJoin"/>
                   Create new Community
                 </div>}
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
