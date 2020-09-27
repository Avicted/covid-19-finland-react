import { CovidApi } from '../../../api/covidApi'
import {
    dashboardActions,
    DashboardActionTypes,
    FetchData,
    FetchHcdTestData,
    FetchTHLData,
} from '../actions/dataActions'
import { call, put, takeLatest } from 'redux-saga/effects'
import { FinnishCoronaData } from '../../../entities/FinnishCoronaData'
import { HcdTestData } from '../../../entities/HcdTestData'
import { ThlTestData } from '../../../entities/ThlTestData'

const covidApi = new CovidApi()

// Watcher saga
export function* loadDataSaga() {
    yield takeLatest(DashboardActionTypes.FetchData, loadFinnishCoronaDataFlow)
}

// Worker saga
function* loadFinnishCoronaDataFlow(action: FetchData) {
    try {
        const data: FinnishCoronaData = yield call(covidApi.getFinnishCoronaData)
        yield put(dashboardActions.FetchDataSuccess(data))
    } catch (error) {
        yield put(dashboardActions.FetchDataError(error))
    }
}

// Watcher saga
export function* loadHcdTestDataSaga() {
    yield takeLatest(DashboardActionTypes.FetchHcdTestData, loadHcdTestDataFlow)
}

// Worker saga
function* loadHcdTestDataFlow(action: FetchHcdTestData) {
    try {
        const hcdTestData: HcdTestData = yield call(covidApi.getHcdTestData)
        yield put(dashboardActions.FetchHcdTestDataSucces(hcdTestData))
    } catch (error) {
        yield put(dashboardActions.FetchHcdTestDataError(error))
    }
}

// Watcher saga
export function* loadTHLDataSaga() {
    yield takeLatest(DashboardActionTypes.FetchTHLData, loadTHLDataFlow)
}

// Worker saga
function* loadTHLDataFlow(action: FetchTHLData) {
    try {
        const thlData: ThlTestData = yield call(covidApi.getThlTestData)
        yield put(dashboardActions.FetchTHLDataSuccess(thlData))
    } catch (error) {
        yield put(dashboardActions.FetchTHLDataError(error))
    }
}
