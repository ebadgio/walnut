const quickchatReducer = (state = {
  postFollowers: [],
  isOpen: false,
  postData: {}
}, action) => {
  switch (action.type) {
    case 'GET_QUICKCHAT_FOLLOWERS_DONE':
      return {
        ...state,
        postFollowers: action.followers
      };
    case 'OPEN_QUICKCHAT':
      return {
        ...state,
        postData: action.postData,
        isOpen: true
      };
    default:
      return state;
  }
};
export default quickchatReducer;
