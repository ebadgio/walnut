const dimmerReducer = (state = false, action) => {
  switch(action.type) {
    case 'DIMMER_ON':
      return true;
    case 'DIMMER_OFF':
      return false;
    default:
      return state;
  }
};

export default dimmerReducer;
