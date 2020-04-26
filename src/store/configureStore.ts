import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { dataReducer } from './reducers/reducer'

const loggerMiddleware = createLogger()
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose;
const middlewares = [
  thunk,
  loggerMiddleware
];

const rootReducer = combineReducers({
  dataReducer,
})

export type AppState = ReturnType<typeof rootReducer>

export default function configureStore() {
  return createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(...middlewares),
    )
  )
}