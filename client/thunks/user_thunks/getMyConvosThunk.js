import axios from 'axios';
import URL from '../../info';

const getMyConvosThunk = (convos) => (dispatch) => {
  const param = convos.join('+');
  axios.get(URL + 'db/get/myconversations/' + param)
    .then((response) => {
      const reversed = response.data.posts.reverse();
      if (response.data.posts.length > 0) {
        dispatch({type: 'SELECT_TOP_DEFAULT', firstPost: reversed[0]});
        dispatch({ type: 'GET_MY_CONVOS_DONE', posts: reversed });
      }
      if (response.data.posts.length === 0) {
        dispatch({ type: 'GOT_NO_CONVOS' });
      }
    })
    .catch((error) => {
      console.log('get my convos error', error);
    });
};
export default getMyConvosThunk;
