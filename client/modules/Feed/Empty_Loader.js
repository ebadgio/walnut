import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Divider } from 'semantic-ui-react';


class EmptyLoader extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
        <Segment className="emptyLoaders">
            <div className="animatedBackground">
                <div className="postContentBlank">
                    <div className="postUser" id="postUser">
                        <div className="avatarBlankHolder">
                            <div className="avatarBlank"></div>
                        </div>
                        <div className="postHeaderLoader">
                            <div className="postHeaderBlank"></div>
                            <div className="postHeaderBlankName"></div>
                            <div className="postHeaderBlank"></div>
                            <div className="postHeaderBlankTime"></div>
                            <div className="postHeaderBlank"></div>
                            <div className="postHeaderBlank"></div>
                        </div>

                    </div>
                    <div className="postDescriptionBlank">
                        <div className="postBodyBlank"></div>
                        <div className="postBodyBlank"></div>
                        <div className="postBodySpace"></div>
                        <div className="postBodyBlankHalf"></div>
                    </div>
                </div>
            </div>
            <Divider className="postDividerBlank" fitted />
            <div className="postFootnote">
            </div>
        </Segment>
    );
  }
}

export default EmptyLoader;
