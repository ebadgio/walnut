import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import discoverReducer from './discoverReducer';
import directoryReducer from './directoryReducer';
import userReducer from './userReducer';
import mapReducer from './mapReducer';
import getCommunityReducer from './getCommunityReducer';
import newTagsReducer from './newTagsReducer';
import postReducer from './postReducer';
import conversationReducer from './conversationReducer';
import walnutHomeReducer from './walnutHomeReducer';
import dimmerReducer from './dimmerReducer';
import messengerReducer from './messengerReducer';
import loginReducer from './loginReducer';
import minichatReducer from './minichatReducer';
import editPostReducer from './editPostReducer';
import notificationReducer from './notificationReducer';

const rootReducer = combineReducers({
  conversationReducer: conversationReducer,
  userReducer: userReducer,
  directoryReducer: directoryReducer,
  discoverReducer: discoverReducer,
  mapReducer: mapReducer,
  getCommunityReducer: getCommunityReducer,
  newTagsReducer: newTagsReducer,
  postReducer: postReducer,
  walnutHomeReducer: walnutHomeReducer,
  dimmerReducer: dimmerReducer,
  messengerReducer: messengerReducer,
  loginReducer: loginReducer,
  minichatReducer: minichatReducer,
  editPostReducer: editPostReducer,
  notificationReducer: notificationReducer,
  routing: routerReducer // this reducer is used by React Router in Redux
});

export default rootReducer;
