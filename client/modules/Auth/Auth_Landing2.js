import React from 'react';
import {Link} from 'react-router-dom';
import './Landing.css';
import { Icon } from 'semantic-ui-react';
import {history} from './Auth_index';

class NewLanding extends React.Component {
  render() {
    return(
        <div>
            <div className="mainPhoto">
            </div>
            <Link to="/login">
                <div className="toLogin">
                    Login
                </div>
            </Link>
            <Link to="/signup">
                <div className="toSignup">
                    Sign up
                </div>
            </Link>
            <span className="titleLand">
                Walnut
            </span>
            <div className="sec1">
                <div className="logoCont">
                    <div className="p1logoBack2">
                        <img src="https://s3.amazonaws.com/walnut-logo/logo.svg" className="p1logo" />
                    </div>
                </div>
                <span className="whereText">
                    Where communities engage
                </span>
                <div className="contentGroup">
                    <div className="infoGroup">
                        <div className="infoTitle">
                            Bring your community together
                        </div>
                        <div className="infoBody">
                            Create a social network centered around your community,
                            allowing you to stay connected and share anytime, from anywhere.
                        </div>
                    </div>
                    <img src="https://s3-us-west-1.amazonaws.com/walnut-test/discover+minichatsNew.png"
                         className="sec1_ph1"/>
                    <img src="https://s3-us-west-1.amazonaws.com/walnut-test/Screen+Shot+2017-11-13+at+10.04.26+PM.png"
                        className="sec1_ph2"/>
                </div>
            </div>
            <div className="togetherPhoto">
            </div>
            <div className="sec2">
                <div className="infoGroup2">
                    <div className="infoTitle">
                        Change the way your community talks
                    </div>
                    <div className="infoBody">
                        Posts on Walnut create a chat to foster deeper
                        and more engaging discussions.
                    </div>
                </div>
                <img src="https://s3-us-west-1.amazonaws.com/walnut-test/minichats.png"
                     className="sec2_ph1"/>
                <img src="https://s3-us-west-1.amazonaws.com/walnut-test/post5.png"
                     className="sec2_ph3"/>
                <img src="https://s3-us-west-1.amazonaws.com/walnut-test/post2.png"
                     className="sec2_ph2"/>
                <img src="https://s3-us-west-1.amazonaws.com/walnut-test/Screen+Shot+2017-11-13+at+9.58.44+PM+copy.png"
                     className="sec2_ph4"/>
            </div>
            <div className="conversationPhoto">
            </div>
            <div className="sec3">
                <div className="infoGroup3">
                    <div className="infoTitle">
                        Keep your content organized and easy to find
                    </div>
                    <div className="infoBody">
                        Add topics to your posts so people can find them later.
                    </div>
                </div>
                <img src="https://s3-us-west-1.amazonaws.com/walnut-test/Screen+Shot+2017-11-13+at+9.34.26+PM+copy.png"
                     className="sec3_ph1"/>
                <img src="https://s3-us-west-1.amazonaws.com/walnut-test/Screen+Shot+2017-11-14+at+1.06.06+PM.png"
                     className="sec3_ph2"/>
                <img src="https://s3-us-west-1.amazonaws.com/walnut-test/Screen+Shot+2017-11-14+at+1.03.52+PM.png"
                     className="sec3_ph3"/>
                <img src="https://s3-us-west-1.amazonaws.com/walnut-test/Screen+Shot+2017-11-14+at+1.04.04+PM.png"
                     className="sec3_ph4" />
            </div>
            <div className="organizedPhoto">
            </div>
            <div className="sec4">
                <div className="infoGroup">
                    <div className="infoTitle">
                        Stay up to date with conversations that matter
                    </div>
                    <div className="infoBody">
                        Follow posts that interest you and come back to
                        the conversation when it’s convenient for you.
                    </div>
                </div>
                <img src="https://s3-us-west-1.amazonaws.com/walnut-test/conversationsNew.png"
                    className="sec4_ph1"/>
                <img src="https://s3-us-west-1.amazonaws.com/walnut-test/extractedpost+copy.png"
                    className="sec4_ph2"/>
                <img src="https://s3-us-west-1.amazonaws.com/walnut-test/Screen+Shot+2017-11-13+at+9.58.33+PM+copy.png"
                    className="sec4_ph3"/>
            </div>
            <div className="keepTrackPhoto">
            </div>
             <div className="logoCont" style={{background: '#fff'}}>
                 <div className="p1logoBack">
                     <img src="https://s3.amazonaws.com/walnut-logo/logo.svg" className="p1logo" />
                 </div>
             </div>
             <div className="endPhoto">
             </div>
             <div className="bottomSec">
                 <div className="finalWords">Take your community to the next level with Walnut</div>
                 <Link to="/signup">
                 <div className="getStarted">Get Started</div>
                 </Link>
                 <img src="https://s3-us-west-1.amazonaws.com/walnut-test/mobileeg.png" className="mobileEg"/>
                 <h5 className="contactUs2">Get in touch with us</h5>
                 <a id="emailLink" href="mailto:info@walnutnetwork.com">
                     <Icon name="mail outline" className="emailIcon2"/>
                 </a>
             </div>
        </div>
    );
  }
}

export default NewLanding;
