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
};
export default emailRegistrationThunk;
