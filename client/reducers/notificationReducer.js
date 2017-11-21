const notificationReducer = (state = {
  newPosts: [],
  isHidden: ''
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
    case 'CHANGE_WINDOW_STATUS':
      return {
        ...state,
        isHidden: action.isHidden
      };
    default:
      return state;
  }
};
export default notificationReducer;
