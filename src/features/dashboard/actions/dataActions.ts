import { Action } from 'redux'
import { FinnishCoronaData } from '../../../entities/FinnishCoronaData'
import { HcdTestData } from '../../../entities/HcdTestData'
import { ThlTestData } from '../../../entities/ThlTestData'

export enum DashboardActionTypes {
    FetchData = 'Dashboard/FetchData',
    FetchDataSuccess = 'Dashboard/FetchDataSuccess',
    FetchDataError = 'Dashboard/FetchDataError',
    FetchHcdTestData = 'Dashboard/FetchHcdTestData',
    FetchHcdTestDataSuccess = 'Dashboard/FetchHcdTestDataSucces',
    FetchHcdTestDataError = 'Dashboard/FetchHcdTestDataError',
    FetchTHLData = 'Dashboard/FetchTHLData',
    FetchTHLDataSuccess = 'Dashboard/FetchTHLDataSuccess',
    FetchTHLDataError = 'Dashboard/FetchTHLDataError',
}

export interface FetchData extends Action {
    type: DashboardActionTypes.FetchData
}

export interface FetchDataSuccess extends Action {
    type: DashboardActionTypes.FetchDataSuccess
    data: FinnishCoronaData
}

export interface FetchDataError extends Action {
    type: DashboardActionTypes.FetchDataError
    error: string
}

export interface FetchHcdTestData extends Action {
    type: DashboardActionTypes.FetchHcdTestData
}

export interface FetchHcdTestDataSucces extends Action {
    type: DashboardActionTypes.FetchHcdTestDataSuccess
    data: HcdTestData
}

export interface FetchHcdTestDataError extends Action {
    type: DashboardActionTypes.FetchHcdTestDataError
    error: string
}

export interface FetchTHLData extends Action {
    type: DashboardActionTypes.FetchTHLData
}

export interface FetchTHLDataSuccess extends Action {
    type: DashboardActionTypes.FetchTHLDataSuccess
    data: ThlTestData
}

export interface FetchTHLDataError extends Action {
    type: DashboardActionTypes.FetchTHLDataError
    error: string
}

export const dashboardActions = {
    FetchData: (): FetchData => ({
        type: DashboardActionTypes.FetchData,
    }),
    FetchDataSuccess: (data: FinnishCoronaData): FetchDataSuccess => ({
        type: DashboardActionTypes.FetchDataSuccess,
        data,
    }),
    FetchDataError: (error: string): FetchDataError => ({
        type: DashboardActionTypes.FetchDataError,
        error,
    }),
    FetchHcdTestData: (): FetchHcdTestData => ({
        type: DashboardActionTypes.FetchHcdTestData,
    }),
    FetchHcdTestDataSucces: (data: HcdTestData): FetchHcdTestDataSucces => ({
        type: DashboardActionTypes.FetchHcdTestDataSuccess,
        data,
    }),
    FetchHcdTestDataError: (error: string): FetchHcdTestDataError => ({
        type: DashboardActionTypes.FetchHcdTestDataError,
        error,
    }),
    FetchTHLData: (): FetchTHLData => ({
        type: DashboardActionTypes.FetchTHLData,
    }),
    FetchTHLDataSuccess: (data: ThlTestData): FetchTHLDataSuccess => ({
        type: DashboardActionTypes.FetchTHLDataSuccess,
        data,
    }),
    FetchTHLDataError: (error: string): FetchTHLDataError => ({
        type: DashboardActionTypes.FetchTHLDataError,
        error,
    }),
}

export type DashboardActions =
    | FetchData
    | FetchDataSuccess
    | FetchDataError
    | FetchHcdTestData
    | FetchHcdTestDataSucces
    | FetchHcdTestDataError
    | FetchTHLData
    | FetchTHLDataSuccess
    | FetchTHLDataError

export function fetchData(): FetchData {
    return {
        type: DashboardActionTypes.FetchData,
    }
}

export function fetchHcdTestData(): FetchHcdTestData {
    return {
        type: DashboardActionTypes.FetchHcdTestData,
    }
}

export function fetchTHLData(): FetchTHLData {
    return {
        type: DashboardActionTypes.FetchTHLData,
    }
}
