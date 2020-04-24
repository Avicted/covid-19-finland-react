import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers/reducers'

const loggerMiddleware = createLogger()

// export default function configureStore(preloadedState: any) {
export default function configureStore() {
  return createStore(
    rootReducer,
    // preloadedState,
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  )
}