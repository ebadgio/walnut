const walnutHomeReducer = (state = {
  isReady: false,
  isJoiningCode: false,
  joiningCodeSuccess: false,
  joiningCodeError: false
}, action) => {
  switch(action.type) {
    case 'WALNUT_READY':
      return {
        ...state,
        isReady: true
      };
    case 'JOINING_CODE':
      return {
        ...state,
        isJoiningCode: true
      };
    case 'JOINING_CODE_DONE':
      return {
        ...state,
        isJoiningCode: false,
        joiningCodeSuccess: true
      };
    case 'JOINING_CODE_ERROR':
      return {
        ...state,
        isJoiningCode: false,
        joiningCodeError: true
      };
    case 'JOINING_CODE_ERROR_DONE':
      return {
        ...state,
        joiningCodeError: false
      };
    default:
      return state;
  }
};
export default walnutHomeReducer;
