

const userReducer = (state = {
  loginDisplay: 1
}, action) => {
  switch (action.type) {
    case 'REGISTER_IS_OPEN':
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
      };
    default:
      return state;
  }
};

export default userReducer;
