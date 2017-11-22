import firebaseApp from '../../firebase';
import axios from 'axios';
import URL from '../../info';
import { history } from '../../modules/Auth/Auth_index';


const checkBrowserStallThunk = () => (dispatch) => {
  console.log('inside checking for browser stall thunk');
  axios.post(URL + 'auth/checkstall', {
  })
    .then((res) => {
      if (!res.data.success) {
        localStorage.clear();
        history.replace('/');
      }
    })
    .catch((error) => {
      console.log('browser check error', error);
    });
};
export default checkBrowserStallThunk;
