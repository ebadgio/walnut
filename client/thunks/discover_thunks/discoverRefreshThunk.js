
import axios from 'axios';
import URL from '../../info';

const discoverRefreshThunk = (lastRefresh, filters) => (dispatch) => {
  axios.get(URL + 'db/get/discoverrefresh?lastRefresh=' + lastRefresh + '&filters=' + JSON.stringify(filters))
    .then((response) => {
      dispatch({
        type: 'GET_DISCOVER_DATA_REFRESH',
        posts: response.data.posts,
        lastRefresh: response.data.lastRefresh,
      });
    })
    .catch((err) => {
      console.log('error in discoverThunk', err, err.response, err.response.headers);
      dispatch({ type: 'GET_DISCOVER_DATA_ERROR' });
    });
};

export default discoverRefreshThunk;

