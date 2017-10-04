const loginReducer = (state = {
  loginDisplay: 1,
  user: ''
}, action) => {
  switch (action.type) {
    case 'REGISTER_OPEN':
      return {
        ...state,
        loginDisplay: 2,
      };
    case 'USER_IS_NOT_VERIFIED':
      return {
        ...state,
        loginDisplay: 3,
      };
    case 'IS_VERIFIED':
      return {
        ...state,
        loginDisplay: 4,
        user: action.user
      };
    case 'GET_USER_VERIFY_ERROR':
      return {
        ...state,
        loginDisplay: 3
      };
    default:
      return state;
  }
};

export default loginReducer;
