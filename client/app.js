import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Auth from './modules/Auth/Auth_index';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import rootReducer from './reducers/index';
import thunk from 'redux-thunk';


const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Provider store={store}>
        <Auth />
  </Provider>,
   document.getElementById('root'));
