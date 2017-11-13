const notificationReducer = (state = {
  newPosts: []
}, action) => {
  switch (action.type) {
    case 'GET_POST_NOTIFICATION':
      return {
        ...state,
        newPosts: action.posts
      };
    case 'CLEAR_NEW_POST_NOTIFICATION':
      return {
        ...state,
        newPosts: []
      };
    default:
      return state;
  }
};
export default notificationReducer;
