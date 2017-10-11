import axios from 'axios';
import URL from '../../info';

const joinCommunityCodeThunk = (id) => (dispatch) => {
  axios.post(URL + 'db/join/community/code', {
    code: id
  })
        .then((response) => {
          dispatch({ type: 'GET_USER_DATA_DONE', user: response.data.user });
        })
        .catch((err) => {
          console.log('probably failed to join community', err);
        });
};
export default joinCommunityCodeThunk;
