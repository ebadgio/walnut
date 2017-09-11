import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon } from 'semantic-ui-react';
import './Post.css';
import fileDownload from 'react-file-download';
import Lightbox from 'react-images';

class AttachmentPreviewComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverDownloadCard: false,
      lightBoxData: ''
    };
  }

  toggleDownloadHover() {
    this.setState({ hoverDownloadCard: !this.state.hoverDownloadCard });
  }

  downloadS3(url, name) {
    console.log('url download', url, name);
    fileDownload(url, name);
  }

  renderLightBox(data) {
    this.setState({ lightBoxData: data });
  }

  closeLightbox() {
    this.setState({ lightBoxData: '' });
    console.log('this is closed', this.state.lightBoxData);
  }

  whatShouldIRender() {
    if (this.props.attachment.type === 'image/jpeg' || this.props.attachment.type === 'image/png') {
      return (
                <div className="imageAttachmentComment" >
                    <img className="postImage" onClick={() => this.renderLightBox(this.props.attachment)} size="medium" src={this.props.attachment.url} />
                </div>
            );
    }
    if (this.props.attachment.type === 'application/pdf') {
      return (
                <div className="mediaDownloadAttachment">
                    <Card className="downloadCardComment" onMouseEnter={() => this.toggleDownloadHover()} onMouseLeave={() => this.toggleDownloadHover()}>
                        <Icon id="mediaIcon" name="file pdf outline" size="huge" />
                        <p className="downloadFileNameComment">{this.props.attachment.name}</p>
                        {this.state.hoverDownloadCard ?
                            <div className="pdfIcons">
                                <a href={this.props.attachment.url} target="pdf-frame"><Icon className="viewButtonPDF" name="eye" size="big" /></a>
                                <a href={this.props.attachment.url} download><Icon className="downloadButtonPDF" name="cloud download" size="big" /></a>
                            </div>
                            : null}
                    </Card>
                </div>
            );
    }
    if (this.props.attachment.type === 'video/mp4' || this.props.attachment.type === 'video/quicktime' || this.props.attachment.type === 'video/mov') {
      return (
                <div className="mediaDownloadAttachment">
                    <Card className="downloadCardComment" onMouseEnter={() => this.toggleDownloadHover()} onMouseLeave={() => this.toggleDownloadHover()}>
                        <Icon id="mediaIcon" name="file video outline" size="huge" />
                        <p className="downloadFileNameComment">{this.props.attachment.name}</p>
                        {this.state.hoverDownloadCard ? <Icon onClick={() => this.downloadS3(this.props.attachment.url, this.props.attachment.name)} className="downloadButton" name="cloud download" size="big" /> : null}
                    </Card>ki
        </div>
            );
    }
    if (this.props.attachment.type === 'text/javascript') {
      return (
                <div className="mediaDownloadAttachment">
                    <Card className="downloadCardComment" onMouseEnter={() => this.toggleDownloadHover()} onMouseLeave={() => this.toggleDownloadHover()}>
                        <Icon id="mediaIcon" name="file code outline" size="huge" />
                        <p className="downloadFileNameComment">{this.props.attachment.name}</p>
                        {this.state.hoverDownloadCard ? <Icon onClick={() => this.downloadS3(this.props.attachment.url, this.props.attachment.name)} className="downloadButton" name="cloud download" size="big" /> : null}
                    </Card>
                </div>
            );
    }
    return (
            <div className="mediaDownloadAttachment">
                <Card className="downloadCardComment" onMouseEnter={() => this.toggleDownloadHover()} onMouseLeave={() => this.toggleDownloadHover()}>
                    <Icon id="mediaIcon" name="file outline" size="huge" className="downloadFileIcon" />
                    <p className="downloadFileNameComment">{this.props.attachment.name}</p>
                    {this.state.hoverDownloadCard ? <Icon onClick={() => this.downloadS3(this.props.attachment.url, this.props.attachment.name)} className="downloadButton" name="cloud download" size="big" /> : null}
                </Card>
            </div>
        );
  }

  render() {
    const snippet = this.whatShouldIRender();
    console.log('am rendering incorrectly');
    return (
            <div>
            <Lightbox
                images={[{
                  src: this.state.lightBoxData.url,
                  caption: this.state.lightBoxData.name
                }]}
                isOpen={this.state.lightBoxData !== ''}
                onClose={() => this.closeLightbox()}
            />
                {snippet}
            </div>
        );
  }
}

AttachmentPreviewComment.propTypes = {
  attachment: PropTypes.object
};

export default AttachmentPreviewComment;
