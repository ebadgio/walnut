import axios from 'axios';
import URL from '../../info';

const joinCommunityCodeThunk = (id) => (dispatch) => {
  dispatch({ type: 'JOINING_CODE'});
  axios.post(URL + 'db/join/community/code', {
    code: id
  })
  .then((response) => {
    console.log('response', response.data);
    if (!response.data.success) {
      dispatch({ type: 'JOINING_CODE_ERROR' });
      dispatch({ type: 'ZERO_CODE' });
    } else {
      dispatch({ type: 'JOINING_CODE_DONE' });
      dispatch({ type: 'ZERO_CODE' });
      dispatch({ type: 'GET_USER_DATA_DONE', user: response.data.user });
    }
  })
  .catch((err) => {
    console.log('probably failed to join community', err);
  });
};
export default joinCommunityCodeThunk;
