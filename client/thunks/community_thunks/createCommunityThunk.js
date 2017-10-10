
import axios from 'axios';
import URL from '../../info';

const createCommunityThunk = (image, title, status, otherTags, newMembers) => (dispatch) => {
  console.log('thunk', status, otherTags);
  axios.post(URL + 'db/create/community', {
    title: title,
    image: image,
    status: status,
    otherTags: otherTags
  })
    .then((response) => {
      dispatch({type: 'GET_USER_DATA_DONE', user: response.data.user});
      dispatch({ type: 'GET_ALL_COMMUNITIES_NEW', communities: response.data.communities});
      if (newMembers) {
        axios.post(URL + 'email/community/invites', {
          newMembers: newMembers,
          communityID: response.data.communityID
        })
        .catch((err) => {
          console.log('failed to send mail to users', err);
        });
      }
    })
    .catch((err) => {
      console.log('probably failed to create community', err);
    });
};
export default createCommunityThunk;
