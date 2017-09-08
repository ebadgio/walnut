import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import YouTube from 'react-youtube';

class LinkPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meta: {},
      youtube: ''
    };
  }

  componentWillMount() {
    if (this.props.url.split('.')[1] === 'youtube') {
            // TODO take set states out of will mount
      this.setState({ youtube: this.props.url.split('v=')[1] });
      return;
    }
    axios.post('/db/get/linkpreview', {
      url: this.props.url
    })
            .then((response) => {
              if (this.refs.myRef) {
                this.setState({ meta: response.data.meta });
              }
            })
            .catch((err) => {
              console.log('error in meta scrape', err);
            });
  }

  validURL(str) {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
      return false;
    }
    return true;
  }

  render() {
    const validURL = this.validURL(this.state.meta.image);
    const opts = {
      height: '60px',
      width: '100px',
      playerVars: {
        autoplay: 0
      }
    };
    return (
            <div ref="myRef" className="linkPrevComment">
        {((this.state.youtube === '') && (validURL && this.state.meta.description && this.state.meta.title)) ?
                    <div className="lineLeftComment"></div> : null
                }
                <div className="linkPreviewCommentWrapper">
                  {(validURL && this.state.meta.description && this.state.meta.title) ?
                        <div className="linkPreviewComment">
                            <a href={this.state.meta.url}><h3 className="linkTitleComment">{this.state.meta.title}</h3></a><br />
                            <p className="linkDescComment">{this.state.meta.description}</p><br />
                            <div className="linkImageComment">
                                <img className="linkImgComment" src={this.state.meta.image} />
                            </div>
                        </div>
                        : null
                    }
                    {(this.state.youtube !== '') ?
                        <YouTube
                            videoId={this.state.youtube}
                            opts={opts}
                            onReady={this._onReady}
                        /> : null
                    }
                </div>
            </div>
        );
  }
}
LinkPreview.propTypes = {
  url: PropTypes.string
};

export default LinkPreview;
