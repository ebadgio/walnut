/**
 * Created by ebadgio on 7/24/17.
 */
import axios from 'axios';
import URL from '../../info';

const createCommunityThunk = (image, title, otherFilters) => (dispatch) => {
  axios.post(URL + 'db/create/community', {
    title: title,
    image: image,
    otherTags: otherFilters
  })
    .then((response) => {
      dispatch({type: 'GET_USER_DATA_DONE', user: response.data.user});
      dispatch({ type: 'GET_ALL_COMMUNITIES_NEW', communities: response.data.communities});
    })
    .catch((err) => {
      console.log('probably failed to create community', err);
    });
};
export default createCommunityThunk;
