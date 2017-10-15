import axios from 'axios';
import URL from '../../info';


const newPostThunk = (newPostBody, postId) => (dispatch) => {
  axios.post(URL + 'db/save/editPost', {
    newPostBody: newPostBody,
    postId: postId
  })
    .then((response) => {
      console.log('edited Post here', response.data);
      dispatch({type: 'DONE_SAVING', editedPost: response.data.editedPost});
    })
    .catch((err) =>{
      dispatch({type: 'DONE_SAVING_ERROR'});
      console.log('error in edit post thunk', err);
    });
};

export default newPostThunk;
