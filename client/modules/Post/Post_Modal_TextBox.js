
import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea } from 'semantic-ui-react';

class ModalTextBox extends React.Component {
  render() {
    return (
            <Form className="textBoxForm">
                <TextArea
                    id="messageInput"
                    autoHeight
                    placeholder="Give your two cents..."
                    onChange={(e) => { this.props.handleChange(e); this.props.findEnter(); }}
                    rows={3}
                />
            </Form>
        );
  }
}

ModalTextBox.propTypes = {
  handleChange: PropTypes.func,
  findEnter: PropTypes.func,
  comment: PropTypes.string
};

export default ModalTextBox;
