const defaultState = {
  attachment: {name: '', url: '', type: ''},
  commentNumber: 0,
  content: 'test',
  createdAt: '2017-09-10T23:02:47.343Z',
  likes: [],
  link: '',
  pictureURL: '',
  postId: '',
  tags: [],
  username: ''
};

const modalReducer = (state = {postData: defaultState, postFollowers: [], open: false}, action) => {
  switch(action.type) {
    case 'MAKE_OPEN':
      return {
        ...state,
        postData: action.postData,
        open: true
      };
    case 'MAKE_CLOSED':
      return {
        postFollowers: [],
        postData: defaultState,
        open: false
      };
    case 'TOGGLE_DATA':
      return {
        ...state,
        postData: action.newPostData,
        open: true
      };
    case 'GET_FOLLOWERS_DONE':
      return {
        ...state,
        postFollowers: action.followers
      };
    default:
      return state;
  }
};
export default modalReducer;
