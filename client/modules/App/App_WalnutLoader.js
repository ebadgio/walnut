import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { Loader } from 'semantic-ui-react';


class WalnutLoader extends React.Component {

  render() {
    return (
        <div className="walnutLoading">
            <div className="loadingContainer">
                <h1 className="walnutHead">Walnut</h1>
                <Loader active/>
            </div>
        </div>
    );
  }
}


WalnutLoader.propTypes = {
};


export default WalnutLoader;
