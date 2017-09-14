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
    // return (
    //   <div className="LeftSidebar_Online">
    //     <div className="discoverTitleBox">
    //         <div className="onlineInline">
    //             <div className="onlineCircle"></div>
    //             <h1 className="discoverTitle">Online</h1>
    //         </div>
    //         <div className="discoverTitleLine"></div>
    //         <Item.Group className="itemGroupOnline">
    //             {this.state.people.map(person => (
    //                 <Item>
    //                     <Item.Content verticalAlign="middle">
    //                             <div className="imageWrapperOnline">
    //                                 <img className="postUserImage" src={person.pictureURL} />
    //                             </div>
    //                         <div className="onlineName">{person.name}</div>
    //                     </Item.Content>
    //                 </Item>
    //             ))}
    //         </Item.Group>
    //     </div>
    //   </div>
    // );
    return (
      <Sidebar.Pushable className="onlinePushable">
        <Sidebar className="onlineSidebar"
                 animation="push"
                 direction="bottom"
                 visible={this.state.visible}>
          <Button icon onClick={() => this.toggleVisibility()} className="minifyButton">
            <Icon name="chevron circle down"
                  size="large"
            />
          </Button>
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
        </Sidebar>
        <Sidebar.Pusher>
            {!this.state.visible ? <Segment className="onlineTab" onClick={() => this.toggleVisibility()}>
            <div className="onlineInline">
              <div className="onlineCircle"></div>
              <p className="discoverOnlineTitle">Online</p>
            </div>
          </Segment> : null}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
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
