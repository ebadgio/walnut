
import axios from 'axios';
import URL from '../../info';
import firebaseApp from '../../firebase';

const newPostThunk = (postBody, postTags, newTags, lastRefresh, filters) => (dispatch) => {
  const user = firebaseApp.auth().currentUser;
  axios.post(URL + 'db/save/post', {
    postBody: postBody,
    postTags: postTags,
    newTags: newTags,
    lastRefresh: lastRefresh,
    filters: filters
  })
    .then((response) => {
      const updates = {};
      updates['/follows/' + user.uid + '/' + response.data.userComm + '/' + response.data.postId] = true;
      updates['/followGroups/' + response.data.postId + '/' + user.uid] = true;
      firebaseApp.database().ref().update(updates);
      dispatch({ type: 'GET_DISCOVER_DATA_REFRESH', posts: response.data.posts,
      lastRefresh: response.data.lastRefresh, otherTags: response.data.otherTags});
      dispatch({type: 'MODAL_TOGGLE'});
    })
    .catch((err) =>{
      console.log('error in new post', err);
    });
};

export default newPostThunk;
