import React from 'react';
import PropTypes from 'prop-types';
import './Post.css';
import { Button, Modal, Input } from 'semantic-ui-react';


class FileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileBody: ''
    };
  }


  render() {
    return (
            <Modal size={'small'} basic
                open={this.props.fileName}
                closeIcon="close"
                onClose={()=> this.props.handleFileClose()}>
                <Modal.Content image scrolling className="scrollContentClass">
                    <h3>Name</h3>
                    <h4>{this.props.fileName}</h4>
                    <h3>Description</h3>
                    <Input id="fileBody" onChange={(e) => this.setState({ fileBody: e.target.value })} />
                    <Button id="fileSubmit" content="send" onClick={() => { this.props.handleFileSubmit(this.state.fileBody); this.setState({ fileBody: '' });}}/>
                </Modal.Content>
            </Modal>
        );
  }
}
FileModal.propTypes = {
  fileName: PropTypes.string,
  handleFileSubmit: PropTypes.func,
  handleFileClose: PropTypes.func
};

export default FileModal;
