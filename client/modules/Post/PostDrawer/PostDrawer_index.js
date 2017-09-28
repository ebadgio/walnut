import React from 'react';
import PropTypes from 'prop-types';
import '../Post.css';
import { connect} from 'react-redux';
import { Icon, Segment } from 'semantic-ui-react';
import firebaseApp from '../../../firebase';
import MessageBox from './PostDrawer_Messages';
import TextBox from './PostDrawer_TextBox';

class PostDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
        <Segment className="postDrawer">
            <MessageBox postData={this.props.postData} currentUser={this.props.currentUser}/>
            <TextBox postData={this.props.postData} members={this.props.members} currentUser={this.props.currentUser}/>
        </Segment>
    );
  }
}


PostDrawer.propTypes = {
  postData: PropTypes.object,
  currentUser: PropTypes.object,
  members: PropTypes.array
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(PostDrawer);
