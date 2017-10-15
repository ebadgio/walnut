const defaultEdit = {
  postId: '',
  username: '',
  pictureURL: '',
  content: '',
  createdAt: '',
  tags: '',
  likes: '',
  commentNumber: '',
  link: '',
  attachment: ''
};

const editPostReducer = (state = {
  saving: false,
  edited: defaultEdit,
  saveError: false
}, action) => {
  switch (action.type) {
    case 'IS_SAVING':
      return {
        ...state,
        saving: true
      };
    case 'DONE_SAVING':
      return {
        edited: action.editedPost,
        saving: false,
        saveError: false
      };
    case 'DONE_SAVING_ERROR':
      return {
        edited: defaultEdit,
        saving: false,
        saveError: true
      };
    default:
      return state;
  }
};
export default editPostReducer;
