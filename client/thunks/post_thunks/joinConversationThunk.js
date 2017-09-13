import axios from 'axios';
import URL from '../../info';

const joinConversationThunk = (postId) => (dispatch) => {
  axios.post(URL + 'db/save/joinconversation', {
    postId: postId,
  })
    .then((response) => {
    })
    .catch((err)=> {
      console.log('error inside join conversation thunk', err);
    });
};
export default joinConversationThunk;
