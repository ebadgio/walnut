import axios from 'axios';
import URL from '../../info';

const getPostFollowersThunk = (followIds) => (dispatch) => {
  const param = followIds.join('+');
  axios.get(URL + 'db/get/followers/' + param)
    .then((response) => {
      console.log('resp', response);
      dispatch({type: 'GET_CONVERSATION_FOLLOWERS_DONE', followers: response.data.followers });
    })
    .catch((error) => {
      console.log('get followers error in thunk', error);
    });
};
export default getPostFollowersThunk;
