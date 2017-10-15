const defaultEdit = {
  postId: '',
  username: '',
  pictureURL: '',
  content: '',
  createdAt: '',
  tags: [],
  likes: '',
  commentNumber: '',
  link: '',
  attachment: {
    name: '',
    url: '',
    type: ''
  }
};

const editPostReducer = (state = {
  editing: false,
  saving: false,
  edited: defaultEdit,
  saveError: false
}, action) => {
  switch (action.type) {
    case 'STARTED_EDITING':
      return {
        ...state,
        editing: true
      };
    case 'EVERYTHING_DONE':
      return {
        ...state,
        editing: false
      };
    case 'IS_SAVING':
      return {
        ...state,
        saving: true
      };
    case 'DONE_SAVING':
      return {
        ...state,
        edited: action.editedPost,
        saving: false,
        saveError: false
      };
    case 'DONE_SAVING_ERROR':
      return {
        ...state,
        edited: defaultEdit,
        saving: false,
        saveError: true
      };
    default:
      return state;
  }
};
export default editPostReducer;
