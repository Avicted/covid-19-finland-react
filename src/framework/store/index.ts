import { createStore, applyMiddleware } from 'redux'
import rootReducer from './rootReducer'
import { compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { loadDataSaga, loadHcdTestDataSaga, loadTHLDataSaga } from '../../features/dashboard/sagas/dashboardSaga'

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// configure middlewares
const middlewares = [sagaMiddleware]

// compose enhancers
const enhancer = composeEnhancers(applyMiddleware(...middlewares))

// rehydrate state on app start
const initialState = {}

// create store
const store = createStore(rootReducer, initialState, enhancer)

// Run sagas
sagaMiddleware.run(loadDataSaga)
sagaMiddleware.run(loadHcdTestDataSaga)
sagaMiddleware.run(loadTHLDataSaga)

// export store singleton instance
export default store
