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

const modalReducer = (state = {postdata: defaultState, open: false}, action) => {
  switch(action.type) {
    case 'MAKE_OPEN':
      return {
        postData: action.postData,
        open: true
      };
    case 'MAKE_CLOSED':
      return {
        postData: defaultState,
        open: false
      };
    case 'TOGGLE_DATA':
      return {
        postData: action.newPostData,
        open: true
      };
    default:
      return state;
  }
};
export default modalReducer;
