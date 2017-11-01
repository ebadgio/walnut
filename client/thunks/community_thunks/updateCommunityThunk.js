import axios from 'axios';
import URL from '../../info';

const updateCommunityThunk = (title, image, users, admins, newMembers, id) => (dispatch) => {
  axios.post(URL + 'db/update/community', {
    title: title,
    image: image,
    users: users,
    admins: admins
  })
    .then((response) => {
      dispatch({type: 'GET_USER_DATA_DONE', user: response.data.user});
      if (newMembers) {
        console.log('adding emails');
        axios.post(URL + 'email/community/invites', {
          newMembers: newMembers,
          communityID: id
        })
        .catch((err) => {
          console.log('failed to send mail to users', err);
        });
      }
    })
    .catch((err) => {
      console.log('probably failed to update community', err);
    });
};
export default updateCommunityThunk;
