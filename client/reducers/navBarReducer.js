// TODO: not sure this is necessary as all of the logic is done off of window url
const defaultState = {
  tab: 0
};
const navBarReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'CHANGE_NAVBAR_TAB':
      console.log('in reducer', action.tab);
      const send = state;
      send.tab = action.tab;
      return send;
    default:
      return defaultState;
  }
};

export default navBarReducer;
