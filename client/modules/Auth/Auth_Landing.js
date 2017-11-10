import React from 'react';
import {Link} from 'react-router-dom';
import Parallax from 'react-springy-parallax';
import createBrowserHistory from 'history/createBrowserHistory';

export const history = createBrowserHistory();

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
            <div className="p1landingDiv"><img src="https://s3-us-west-1.amazonaws.com/walnut-test/photo-1467826839480-0c2a3783b327.jpeg" className="p1landingImg"/></div>
            </Parallax.Layer>

            <Parallax.Layer
              offset={0}
              speed={0.5}
              className="p1loginButton">
            <Link to={'/login'}><div
              onClick={() => this.login()}
              className="loginRouteButton">Login</div></Link>
            </Parallax.Layer>

            <Parallax.Layer
              offset={0}
              speed={0.5}
              className="p1logoDiv">
            <div className="p1logoBack"><img src="https://s3.amazonaws.com/walnut-logo/logo.svg" className="p1logo" /></div>
            </Parallax.Layer>

            <Parallax.Layer
              offset={0}
              speed={0.25}
              className="p1text">
              Walnut helps communities engage in better conversations online
              </Parallax.Layer>

            <Parallax.Layer
              offset={1}
              speed={0.18}
              className="p2text">
              Share something with your community in order to spark up a conversation
              </Parallax.Layer>

            <Parallax.Layer
              offset={1}
              speed={0.25}
              className="p2display">
              <img src="https://s3-us-west-1.amazonaws.com/walnut-test/newconvo.png" className="p2displayImg" />
              </Parallax.Layer>

            <Parallax.Layer
              offset={2}
              speed={0.18}
              className="p3text">
              Each conversation persists in its respective group chat for your community to engage wherever, whenever
              </Parallax.Layer>

            <Parallax.Layer
              offset={2}
              speed={0.5}
              className="p3display">
            </Parallax.Layer>

            <Parallax.Layer
              offset={2}
              speed={0.25}
              className="p3Img">
              <img src="https://s3-us-west-1.amazonaws.com/walnut-test/discover+minichats.png" className="p3displayImg" />
            </Parallax.Layer>

            <Parallax.Layer
              offset={3}
              speed={0.25}
              className="p4text">
              Topics help keep your communities conversation organized and better content discovery
              </Parallax.Layer>

            <Parallax.Layer
              offset={3}
              speed={0.5}
              className="p4display">
            </Parallax.Layer>

            <Parallax.Layer
              offset={3}
              speed={-0.3}
              className="p4ExtractedPost">
            <img src="https://s3-us-west-1.amazonaws.com/walnut-test/extractedpost.png" className="p4ImgPostE" />
            </Parallax.Layer>

            <Parallax.Layer
              offset={3}
              speed={0.25}
              className="p4PostLeft">
            <img src="https://s3-us-west-1.amazonaws.com/walnut-test/post2.png" className="p4ImgPostL" />
            </Parallax.Layer>

            <Parallax.Layer
              offset={3}
              speed={0.60}
              className="p4PostRight">
            <img src="https://s3-us-west-1.amazonaws.com/walnut-test/post.png" className="p4ImgPostR" />
            </Parallax.Layer>

            <Parallax.Layer
              offset={3}
              speed={0.25}
              className="p4tag">
              Add tags to your conversations
              </Parallax.Layer>

            <Parallax.Layer
              offset={3}
              speed={0.25}
              className="p4filterBy">
              So you can filter them when you need
              </Parallax.Layer>

            <Parallax.Layer
              offset={3}
              speed={-0.3}
              className="p4Filters">
            <img src="https://s3-us-west-1.amazonaws.com/walnut-test/filters.png" className="p4ImgFilter" />
            </Parallax.Layer>

            <Parallax.Layer
              offset={4}
              speed={0.5}
              className="p5text">
              Stay up to date on conversations you wish to follow
              </Parallax.Layer>

            <Parallax.Layer
              offset={2}
              speed={0.5}
              className="p5ImgPara">
              <img src="" className="p3Img" />
            </Parallax.Layer>

            <Parallax.Layer
              offset={2}
              speed={0.5}
              className="p5Display">
            </Parallax.Layer>
          </Parallax>
        </div>
    );
  }
}

export default Landing;
