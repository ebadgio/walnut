import firebaseApp from '../../firebase';
import axios from 'axios';
import URL from '../../info';

const emailRegistrationThunk = (firstname, lastname, email, password) => (dispatch) => {
  dispatch({ type: 'USER_IS_NOT_VERIFIED' });
  dispatch({ type: 'REGISTER_FIREBASE_STOP'});
  const useFirstname = firstname[0].toUpperCase() + firstname.substring(1);
  const useLastname = lastname[0].toUpperCase() + lastname.substring(1);
  firebaseApp.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {
      result.updateProfile({
        displayName: useFirstname + ' ' + useLastname
      })
    .then(() => {
      console.log('current user', firebaseApp.auth().currentUser);
      return firebaseApp.auth().currentUser.sendEmailVerification();
    })
    .then(() => {
      console.log('pre verification');
      result.getIdToken(/* forceRefresh */ true)
        .then((idToken) => {
          axios.post(URL + 'auth/signup', {
            token: idToken,
            fname: useFirstname,
            lname: useLastname,
            email: email,
            password: password
          })
            .then(() => {
              // firebaseApp.auth().signOut()
              //   .then(() => {
              //     localStorage.removeItem('tab');
              //     localStorage.removeItem('url');
              //     localStorage.removeItem('isUserInCommunity');
              //     localStorage.removeItem('home');
              //     sessionStorage.removeItem('url');
              //     sessionStorage.removeItem('tab');
              //     return axios.post('/auth/logout');
              //   })
              //   .then(() => {
              //     dispatch({ type: 'LOGOUT_DONE' });
              //     history.replace('/login');
              //   });
            })
            .catch((error) => {
              console.log('axios did not go through');
            });
        })
          .catch((error) => {
            console.log('could not get token', error);
          });
    })
      .catch((error) => {
        console.log('update user error', error);
      });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('firebase error', error);
      // ...
    });
  // need to create a backend route to create user:
  // var new_user = new User({
  //        fullName: req.body.fname + ' ' + req.body.lname,
  //        username: req.body.username,
  //        password: req.body.password,
  //        preferences: req.body.tags,
  //        portfolio: [
  //          {name: 'media', data: []},
  //          {name: 'documents', data: []},
  //          {name: 'code', data: []},
  //          {name: 'design', data: []}
  //        ],
  //
  //        pictureURL: 'https://s3-us-west-1.amazonaws.com/walnut-test/430-512.png'
  //      });
  //      return new_user.save()
  //      .then((doc) => {
  //        // console.log(doc);
  //        res.status(200);
  //        res.redirect('/')
  //      })
  //      .catch((err) => {
  //        console.log(err);
  //      })
  //    }
};
export default emailRegistrationThunk;
