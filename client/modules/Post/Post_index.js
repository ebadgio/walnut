import React from 'react';
import PropTypes from 'prop-types';
import ModalContainer from './Post_Modal_Container';
import MediaAttachment from './Post_Media_Attachment.js';
import LinkPreview from './LinkPreview';
import './Post.css';
import Lightbox from 'react-images';
import {Divider} from 'semantic-ui-react';



class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nested: this.props.nested,
      likeCount: this.props.postData.likes.length,
      isLiked: this.props.postData.likes.indexOf(this.props.currentUser._id) > 0,
      lightBoxData: '',
      pdfModalData: '',
      page: 1,
      pages: 100,
      urls: [],
      messageBody: '',
      messageBody1: '',
      messageBody2: '',
      newLink: '',
      urlName: ''
    };
  }
  componentWillMount() {
    const urls = this.urlFinder(this.props.postData.content);
    this.setState({urls: urls});
    if (urls.length !== 0) {
      const idx = this.props.postData.content.indexOf(urls[0]);
      const newBody1 = this.props.postData.content.substr(0, idx);
      const newBody2 = this.props.postData.content.substr((idx + urls[0].length), this.props.postData.content.length);
      const newLink = urls[0];
      console.log('post body', newBody1, newBody2);
      this.setState({ messageBody1: newBody1, messageBody2: newBody2, newLink: newLink, urlName: this.urlNamer(newLink)});
    } else {
      this.setState({ messageBody: this.props.postData.content });
    }
  }

  urlNamer(url) {
    const arr = url.split('/')[2].split('.');
    let name = '';
    if (arr.length === 2) {
      name = arr[0];
    } else {
      name = arr[1];
    }
    return name;
  }

  urlFinder(text) {
    const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    const urls = [];
    text.replace(urlRegex, (url, b, c) => {
      const url2 = (c === 'www.') ? 'http://' + url : url;
      urls.push(url2);
    });
    return urls;
  }

  handleClick() {
    this.setState({isOpen: !this.state.isOpen});
  }

  toggleLike() {
    this.props.newLike();
    if (this.state.isLiked) {
      this.setState({likeCount: this.state.likeCount - 1, isLiked: false});
    } else {
      this.setState({likeCount: this.state.likeCount + 1, isLiked: true});
    }
  }

  renderLightBox(data) {
    this.setState({lightBoxData: data});
  }

  closeLightbox() {
    this.setState({lightBoxData: ''});
    console.log('this is closed', this.state.lightBoxData);
  }

  renderPdfModal(data) {
    this.setState({pdfModalData: data});
  }

  closeModal() {
    this.setState({ pdfUrl: '', page: 1 });
  }

  handlePrevious() {
    if(this.state.page === 1) {
      this.setState({ page: this.state.pages });
    } else {
      this.setState({ page: this.state.page - 1 });
    }
  }

  handleNext() {
    if(this.state.page === this.state.pages) {
      this.setState({ page: 1 });
    } else {
      this.setState({ page: this.state.page + 1 });
    }
  }

  onDocumentComplete(pages) {
    this.setState({ page: 1, pages: pages });
  }

  onPageComplete(page) {
    this.setState({ page: page });
  }

  closePdfModal() {
    this.setState({pdfModalData: ''});
  }

  closeDownloadModal() {
    this.setState({downloadUrl: ''});
  }

  render() {
    const urlPrev = this.state.urls.length > 0 ? this.state.urls.map((url) => <LinkPreview url={url} />) : [];
    return (
      <div className="postOuter">
      <div className="postContent">
        <div className="postUser">
          <div className="imageWrapperPost">
              <img className="postUserImage" src={this.props.postData.pictureURL} />
          </div>
          <div className="postHeader">
            <h3 className="postHeaderUser">{this.props.postData.username}</h3>
          </div>
        </div>
        <div className="postDescription">
          <div className="postInnerContent">
            {this.state.messageBody ? this.state.messageBody :
            <div>{this.state.messageBody1} <a href={this.state.newLink}>{this.state.urlName}</a> {this.state.messageBody2}</div>
            }
          </div>
        </div>

        {urlPrev.length > 0 ? urlPrev[0] : null}

        {(this.props.postData.attachment.name !== '') ?
        <MediaAttachment data={this.props.postData.attachment}
        renderLightBox={(data) => this.renderLightBox(data)}
        renderPdfModal={(data) => this.renderPdfModal(data)}/>
        : null}
        <Lightbox
          images={[{
            src: this.state.lightBoxData.url,
            caption: this.state.lightBoxData.name
          }]}
          isOpen={this.state.lightBoxData !== ''}
          onClose={() => this.closeLightbox()}
          />
      </div>

      <Divider className="postDivider" fitted />
      <div className="postFootnote">
        <div className="tagContainer">
          {this.props.postData.tags.map((tag, index) => (
          <div key={index} className="tag">
            <text className="hashtag">#{tag.name}</text>
          </div>))}
        </div>
        <div></div>
        <ModalContainer postData={this.props.postData} currentUser={this.props.currentUser}/>
      </div>
    </div>
    );
  }
}
Post.propTypes = {
  postData: PropTypes.object,
  newLike: PropTypes.func,
  currentUser: PropTypes.object,
  nested: PropTypes.bool
};
export default Post;
