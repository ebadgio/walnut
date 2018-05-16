const conversationReducer = (state = {
  current: '',
  convos: [],
  iDs: [],
  isEmpty: false
}, action) => {
  switch(action.type) {
    case 'GET_MY_CONVOS_DONE':
      return {
        ...state,
        convos: action.posts,
        isEmpty: false
      };
    case 'SWITCH_COM':
      return {
        convos: [],
        iDs: [],
        current: action.communityId
      };
    case 'ADD_IDS':
      return {
        ...state,
        iDs: action.iDs
      };
    case 'GOT_NO_CONVOS':
      return {
        ...state,
        isEmpty: true
      };
    default:
      return state;
  }
};
export default conversationReducer;
