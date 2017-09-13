import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { Loader } from 'semantic-ui-react';


class WalnutLoader extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
        <div className="walnutLoading">
            <div className="loadingContainer">
                <h1 className="walnutHead">Walnut</h1>
                {this.props.community ? <h2 className="loadingCommunity">Loading your community...</h2> : null}
                <Loader active/>
            </div>
        </div>
    );
  }
}


WalnutLoader.propTypes = {
  community: PropTypes.bool
};


export default WalnutLoader;
