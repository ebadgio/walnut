import axios from 'axios';
import URL from '../../info';

const getMyConvosThunk = (convos) => (dispatch) => {
  const param = convos.join('+');
  axios.get(URL + 'db/get/myconversations/' + param)
    .then((response) => {
      dispatch({type: 'GET_MY_CONVOS_DONE', posts: response.data.posts });
    })
    .catch((error) => {
      console.log('get my convos error', error);
    });
};
export default getMyConvosThunk;
