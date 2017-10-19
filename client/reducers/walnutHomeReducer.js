const walnutHomeReducer = (state = {
  isReady: false,
  isJoiningCode: false,
  joiningCodeSuccess: false,
  joiningCodeError: false,
  code: ''
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
    case 'JOINING_CODE_END':
      return {
        ...state,
        isJoiningCode: false,
        joiningCodeError: false,
        joiningCodeSuccess: false
      };
    case 'SAVE_CODE':
      return {
        ...state,
        code: action.code
      };
    case 'ZERO_CODE':
      return {
        ...state,
        code: ''
      };
    default:
      return state;
  }
};
export default walnutHomeReducer;
