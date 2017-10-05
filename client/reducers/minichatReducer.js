const minichatReducer = (state = {
  openChats: []
}, action) => {
  switch (action.type) {
    case 'ADD_CHAT':
      const newState = state;
      newState.openChats.push(action.postData);
      return newState;
    case 'REMOVE_CHAT':
      const newState1 = state;
      newState1.openChats.filter((chat) => chat.postDataId !== action.postData.postId);
      return newState1;
    default:
      return state;
  }
};
export default minichatReducer;
