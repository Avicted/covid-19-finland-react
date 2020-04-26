import { HcdTestData } from './HcdTestData'

export const FETCH_DATA_PENDING = 'FETCH_DATA_PENDING';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_ERROR = 'FETCH_DATA_ERROR';
export const FETCH_HCD_TEST_DATA_PENDING = 'FETCH_HCD_TEST_DATA_PENDING';
export const FETCH_HCD_TEST_DATA_SUCCESS = 'FETCH_HCD_TEST_DATA_SUCCESS';
export const FETCH_HCD_TEST_DATA_ERROR = 'FETCH_HCD_TEST_DATA_ERROR';

export interface FetchDataPendingAction {
    type: typeof FETCH_DATA_PENDING;
}

export interface FetchDataSuccessAction {
    type: typeof FETCH_DATA_SUCCESS;
    payload: any;
}

export interface FetchDataErrorAction {
    type: typeof FETCH_DATA_ERROR;
    error: Boolean;
}

export interface FetchHcdTestDataPendingAction {
    type: typeof FETCH_HCD_TEST_DATA_PENDING;
}

export interface FetchHcdTestDataSuccessAction {
    type: typeof FETCH_HCD_TEST_DATA_SUCCESS;
    payload: HcdTestData;
}

export interface FetchHcdTestDataErrorAction {
    type: typeof FETCH_HCD_TEST_DATA_ERROR;
    error: any;
}

export type DataActionTypes = 
    FetchDataPendingAction | 
    FetchDataSuccessAction | 
    FetchDataErrorAction | 
    FetchHcdTestDataPendingAction | 
    FetchHcdTestDataSuccessAction | 
    FetchHcdTestDataErrorAction

export type AppActions = DataActionTypes