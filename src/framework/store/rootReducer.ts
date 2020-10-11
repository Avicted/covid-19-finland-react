import { combineReducers } from 'redux'
import { dashboardReducer } from '../../features/dashboard/reducers/dashboardReducer'
import { mapReducer } from '../../features/dashboard/reducers/mapReducer'

const rootReducer = combineReducers({
    dashboard: dashboardReducer,
    map: mapReducer,
})

export type AppState = ReturnType<typeof rootReducer>

export default rootReducer
