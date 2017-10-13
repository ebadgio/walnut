import axios from 'axios';
import URL from '../../info';

const joinCommunityCodeThunk = (id) => (dispatch) => {
  axios.post(URL + 'db/join/community/code', {
    code: id
  })
  .then((response) => {
    // TODO: dispatch of both join and toggle
  })
  .catch((err) => {
    console.log('probably failed to join community', err);
  });
};
export default joinCommunityCodeThunk;
