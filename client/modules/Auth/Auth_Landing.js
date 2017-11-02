import React from 'react';
import {Link} from 'react-router-dom';
import Parallax from 'react-springy-parallax';


class Landing extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
        <div>
          <Parallax ref="parallax" pages={5}>

            <Parallax.Layer
              offset={0}
              speed={0.5}
              className="p1landingImgParallax">
              <img src="" className="p1landingImg"/>
            </Parallax.Layer>

            <Parallax.Layer
              offset={0}
              speed={0.5}
              className="p1loginButton">
              <Link to="/login">Sign in</Link>
            </Parallax.Layer>

            <Parallax.Layer
              offset={0}
              speed={0.3}
              className="p1text">
              Walnut helps communities engage in better conversations online
              </Parallax.Layer>

            <Parallax.Layer
              offset={1}
              speed={0.5}
              className="p2text">
              Share something with your community in order to spark up a conversation in its respective group chat
              </Parallax.Layer>

            <Parallax.Layer
              offset={1}
              speed={0.5}
              className="p2display">
              <img src="" className="p2displayImg" />
              </Parallax.Layer>

            <Parallax.Layer
              offset={2}
              speed={0.5}
              className="p3text">
              topics help keep your community organized and better content discovery
              </Parallax.Layer>

            <Parallax.Layer
              offset={2}
              speed={0.5}
              className="p3display">
              <img src="" className="p3displayImg" />
            </Parallax.Layer>

            <Parallax.Layer
              offset={2}
              speed={0.5}
              className="p3display">
              <img src="" className="p3displayImg" />
            </Parallax.Layer>
          </Parallax>
        </div>
    );
  }
}

export default Landing;
