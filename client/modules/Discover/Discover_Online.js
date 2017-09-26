// shows who is online

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebaseApp from '../../firebase';
import { Icon, Segment, Sidebar, Button, Item } from 'semantic-ui-react';
import './Discover.css';

class Online extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      people: [],
      visible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const realThis = this;
    if (nextProps.user.pictureURL) {
      firebaseApp.auth().onAuthStateChanged(function(user) {
        if (user) {
          const amOnline = firebaseApp.database().ref('.info/connected');
          const userRef = firebaseApp.database().ref('/presence/' + nextProps.user.currentCommunity._id + '/' + user.uid);
          amOnline.on('value', snapshot => {
            if (snapshot.val()) {
              userRef.onDisconnect().remove();
              userRef.set({
                name: user.displayName,
                pictureURL: nextProps.user.pictureURL
              });
            }
          });
          if (!realThis.props.user.pictureURL) {
            const allUser = firebaseApp.database().ref('/presence/' + nextProps.user.currentCommunity._id);
            allUser.on('value', snapshot => {
              realThis.setState({people: Object.values(snapshot.val())});
            });
          }
          else {
            const allUser = firebaseApp.database().ref('/presence/' + realThis.props.user.currentCommunity._id);
            allUser.on('value', snapshot => {
              realThis.setState({people: Object.values(snapshot.val())});
            });
          }
        }
      });
    }
  }

  // componentDidMount() {
  //   if (this.props.user.pictureURL) {
  //     const realThis = this;
  //     firebase.auth().onAuthStateChanged(function(user) {
  //       if (user) {
  //         console.log('inside componentdidMount', realThis.props);
  //         const allUser = firebaseApp.database().ref('/presence/' + realThis.props.user.currentCommunity._id);
  //         allUser.on('value', snapshot => {
  //           console.log('allUsers', snapshot.val());
  //           realThis.setState({people: Object.values(snapshot.val())});
  //         });
  //       }
  //     });
  //   }
  // }

  toggleVisibility() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    return (
        <div className="onlineGroup">
            <Segment className="onlineTab" onClick={() => this.toggleVisibility()}>
            <Icon name={this.state.visible ? 'chevron down' : 'chevron right'} className="leftChevronIcon"/>
            <div className="onlineInline">
              <div className="onlineCircle"></div>
              <p className="discoverOnlineTitle">Online</p>
            </div>
          </Segment>
          {this.state.visible ?
              <div className="leftSideBox">
                <Item.Group className="itemGroupOnline">
                    {this.state.people.map(person => (
                        <Item>
                          <Item.Content verticalAlign="middle">
                            <div className="imageWrapperOnline">
                              <img className="postUserImage" src={person.pictureURL} />
                            </div>
                            <div className="onlineName">{person.name}</div>
                          </Item.Content>
                        </Item>
                    ))}
                </Item.Group>
              </div> : null}
        </div>
    );
  }
}

Online.propTypes = {
  user: PropTypes.object
};

const mapStateToProps = (state) => ({
  user: state.userReducer
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Online);
