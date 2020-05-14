import { HcdTestData } from '../../models/HcdTestData'
import { DataActionTypes } from '../../models/actions'
import { FinnishCoronaData } from '../../models/FinnishCoronaData'
import { ThlTestData } from '../../models/ThlTestData'

export type State = {
    readonly finnishCoronaDataPending: Boolean
    readonly finnishCoronaData: FinnishCoronaData
    readonly hcdTestDataPending: Boolean
    readonly hcdTestData: HcdTestData
    readonly thlTestDataPending: Boolean
    readonly thlTestData: ThlTestData
    readonly error: Boolean
}

const initialState: State = {
    finnishCoronaDataPending: false,
    finnishCoronaData: {
        confirmed: [],
        deaths: [],
        recovered: [],
    },
    hcdTestDataPending: false,
    hcdTestData: {},
    thlTestDataPending: false,
    thlTestData: {
        tested: [],
    },
    error: false,
}

export const dataReducer = (state = initialState, action: DataActionTypes) => {
    switch (action.type) {
        case 'FETCH_DATA_PENDING':
            return {
                ...state,
                finnishCoronaDataPending: true,
            }
        case 'FETCH_DATA_SUCCESS':
            return {
                ...state,
                finnishCoronaDataPending: false,
                finnishCoronaData: action.payload,
            }
        case 'FETCH_DATA_ERROR':
            return {
                ...state,
                finnishCoronaDataPending: false,
                error: action.error,
            }
        case 'FETCH_HCD_TEST_DATA_PENDING':
            return {
                ...state,
                hcdTestDataPending: true,
            }
        case 'FETCH_HCD_TEST_DATA_SUCCESS':
            return {
                ...state,
                hcdTestDataPending: false,
                hcdTestData: action.payload,
            }
        case 'FETCH_HCD_TEST_DATA_ERROR':
            return {
                ...state,
                hcdTestDataPending: false,
                error: action.error,
            }
        case 'FETCH_THL_TEST_DATA_PENDING':
            return {
                ...state,
                thlTestDataPending: true,
            }
        case 'FETCH_THL_TEST_DATA_SUCCESS':
            return {
                ...state,
                thlTestDataPending: false,
                thlTestData: action.payload,
            }
        case 'FETCH_THL_TEST_DATA_ERROR':
            return {
                ...state,
                thlTestDataPending: false,
                error: action.error,
            }
        default:
            return state
    }
}
