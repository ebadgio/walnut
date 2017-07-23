import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import { connect } from 'react-redux';

const styles = {
  pic: {
    backgroundColor: 'lightblue',
    marginLeft: '100px',
    width: '65%'
  }
};

class Uploads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      onEdit: false,
      currUrl: ''
    };
  }

  onDrop(files) {
    console.log('inenenenene', files);
    this.setState({files: files, onEdit: true});
  }

  // handleNameChange(update, i) {
  //   const filesArr = this.state.files.slice();
  //   filesArr[i].name = update;
  //   this.setState({files: filesArr});
  // }

  uploadFiles() {
    const files = this.state.files.slice();
    files.forEach((file) => {
      superagent.post('/aws/upload')
        .attach('demo', file)
        .query('port=' + this.props.file)
        .end((err, res) => {
          if (err) {
            console.log(err);
            alert('failed uploaded!');
          }
          console.log('RESPONSE', res);
          alert('File uploaded!');
        });
    });
  }

  renderFile(url) {
    this.setState({currUrl: url});
  }

  render() {
    console.log('state', this.props.file);
    const filesArr = this.props.portfolio[this.props.file];
    return (
          <div>
            {(this.state.currUrl !== '') ? <img style={styles.pic} src={this.state.currUrl} /> : <p></p>}
            {filesArr.map((file) => (
              <div onClick={() => (this.renderFile(file.fileUrl))}>
                <img style={styles.pic} src={ (file.fileType === 'image/png') ? 'http://wfarm3.dataknet.com/static/resources/icons/set112/f2afb6f7.png' : '../../../img/pdf.png' }/>
                <p>{file.fileName}</p>
              </div>
            ))}
            <Dropzone onDrop={this.onDrop.bind(this)} multiple={true}>
              <div>Try dropping a file here, or click to select a file to upload.</div>
            </Dropzone>
            {this.state.files.map((file, i) => (
              <p key={i}>{file.name}</p>
              // <input value={file.name} onChange={(e) => (this.handleNameChange(e.target.value, i))} />
            ))}
            {this.state.onEdit ? <button onClick={() => {this.uploadFiles();}}>Upload</button> : null}
            {/* <img src="https://s3-us-west-1.amazonaws.com/walnut-test/Screen+Shot+2017-07-20+at+10.39.11+AM.png"/> */}
          </div>
      );
  }
}

Uploads.propTypes = {
  portfolio: PropTypes.object,
  file: PropTypes.string
};

const mapStateToProps = (state) => ({
  portfolio: state.createProfileReducer.main.portfolio
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
