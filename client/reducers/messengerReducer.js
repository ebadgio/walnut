const messengerReducer = (state = {postFollowers: [], firstPost: {}, postDataId: ''}, action) => {
  switch(action.type) {
    case 'GET_CONVERSATION_FOLLOWERS_DONE':
      return {
        ...state,
        postFollowers: action.followers
      };
    case 'SELECT_TOP_DEFAULT':
      return {
        ...state,
        firstPost: action.firstPost
      };
    case 'TOGGLE_CURRENT_POST_ID':
      return {
        ...state,
        postDataId: action.id
      };
    default:
      return state;
  }
};
export default messengerReducer;
