
import React from 'react';
import CreateCommunityPage from './App_NewCommunityPage.js';
import {history} from '../Auth/Auth_index';

class NewCommunity extends React.Component {
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
        <div className="create_wrapper">
            <div className="Heading">
                <img src="https://s3.amazonaws.com/walnut-logo/logo.svg" className="logoHome"/>
                <span style={{fontSize: '45px'}}>Walnut</span>
                <div className="logout_button" onClick={() => this.handleLogout()}>
                    Logout
                </div>
            </div>
            <div className="cancel-create" onClick={() => history.replace('/walnuthome')}>
                Cancel
            </div>
            <div className="create_community_paper">
                <CreateCommunityPage closeModal={() => this.closeModal()}/>
            </div>
        </div>
    );
  }
}


NewCommunity.propTypes = {
};


export default NewCommunity;
