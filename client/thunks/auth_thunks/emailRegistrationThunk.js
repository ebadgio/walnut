import firebaseApp from '../../firebase';
import axios from 'axios';
import URL from '../../info';

const emailRegistrationThunk = (firstname, lastname, email, password) => (dispatch) => {
  dispatch({type: 'USER_IS_NOT_VERIFIED'});
  // TODO: dispatch waiting to be verified on /login with resend option (no navbar)
  firebaseApp.auth().createUserWithEmailAndPassword(email, password)
  .then((result) => {
    result.updateProfile({
      displayName: firstname + ' ' + lastname
    })
    .then(() => {
      return firebaseApp.auth().currentUser.sendEmailVerification();
    })
    .then(() => {
      // TODO: listener for if validated
      // TODO: login on backend after reg
      // TODO: redirect to home
      result.getIdToken(/* forceRefresh */ true)
          .then((idToken) => {
            axios.post(URL + 'auth/signup', {
              token: idToken,
              fname: firstname,
              lname: lastname,
              email: email,
              password: password
            })
            .then((res) => {
              // TODO: dispatch ready to login as "email"
              dispatch({type: 'GET_USER_DATA_DONE', user: res.data.user});
              setTimeout(() => dispatch({type: 'WALNUT_READY'}), 1500);
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
