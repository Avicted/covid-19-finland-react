import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers/reducers'
import thunk from 'redux-thunk'

const loggerMiddleware = createLogger()
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose;
const middlewares = [
  thunk,
  loggerMiddleware
];

export default function configureStore() {
  return createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(...middlewares),
    )
  )
}