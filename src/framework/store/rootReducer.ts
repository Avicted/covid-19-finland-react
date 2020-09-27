import { combineReducers } from 'redux'
import { dashboardReducer } from '../../features/dashboard/reducers/dashboardReducer'

const rootReducer = combineReducers({
    dashboard: dashboardReducer,
})

export type AppState = ReturnType<typeof rootReducer>

export default rootReducer
