// TODO: not sure this is necessary as all of the logic is done off of window url
const navBarReducer = (state = 0, action) => {
  switch (action.type) {
    case 'CHANGE_NAVBAR_TAB':
      return action.tab;
    default:
      return 0;
  }
};

export default navBarReducer;
