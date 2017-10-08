const minichatReducer = (state = {
  openChats: []
}, action) => {
  switch (action.type) {
    case 'ADD_CHAT':
      if (state.openChats.length < 3) {
        return {
          openChats: state.openChats.concat(action.postData)
        };
      }
      const send = state.openChats;
      send[2] = action.postData;
      return {
        openChats: send.slice()
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
