import React from 'react';
import {Link} from 'react-router-dom';


class Landing extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
        <div>
          <Link to="/login">Sign in</Link>
          <p>Landing</p>
        </div>
    );
  }
}

export default Landing;
