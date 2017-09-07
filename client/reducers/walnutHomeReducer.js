const walnutHomeReducer = (state = false, action) => {
  switch(action.type) {
    case 'WALNUT_READY':
      return true;
    default:
      return state;
  }
};
export default walnutHomeReducer;
