const minichatReducer = (state = {
  openChats: []
}, action) => {
  switch (action.type) {
    case 'ADD_CHAT':
      return {
        openChats: state.openChats.concat(action.postData)
      };
    case 'REMOVE_CHAT':
      return {
        openChats: state.openChats.filter((chat) => chat.postId !== action.postData.postId)
      };
    default:
      return state;
  }
};
export default minichatReducer;
