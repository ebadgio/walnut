
import firebase from 'firebase';
import axios from 'axios';
import URL from '../../info';


const signInThunk = (email, password, history) => (dispatch) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(result => {
      if (!result.emailVerified) {
        dispatch({ type: 'GET_USER_VERIFY_ERROR', email: email, password: password });
        history.replace('/verify/' + email);
      }
      result.getIdToken(/* forceRefresh */ true)
          .then((idToken) => {
            axios.post(URL + 'auth/login', {
              token: idToken,
              email: email,
              password: password
            })
              .then((res) => {
                dispatch({type: 'LOGIN_APP'});
                dispatch({type: 'GET_USER_DATA_DONE', user: res.data.user});
                if (result.emailVerified) {
                  history.replace('/walnuthome/');
                }
              });
          })
          .catch((error) => {
              // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            dispatch({type: 'GET_USER_DATA_ERROR'});
              // ...
          });
    })
    .catch((error) => {
      // Handle Errors here.
      console.log('you got a fucking error first', error);
      const errorCode = error.code;
      const errorMessage = error.message;
      dispatch({ type: 'GET_USER_DATA_ERROR' });
    });
};

export default signInThunk;
