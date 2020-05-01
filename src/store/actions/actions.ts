import { 
  AppActions, 
  FETCH_DATA_PENDING, 
  FETCH_DATA_SUCCESS, 
  FETCH_DATA_ERROR, 
  FETCH_HCD_TEST_DATA_PENDING, 
  FETCH_HCD_TEST_DATA_SUCCESS, 
  FETCH_HCD_TEST_DATA_ERROR,
  FETCH_THL_TEST_DATA_PENDING, 
  FETCH_THL_TEST_DATA_SUCCESS, 
  FETCH_THL_TEST_DATA_ERROR 
} from "../../models/actions";
import { HcdTestData } from "../../models/HcdTestData";
import { FinnishCoronaData } from "../../models/FinnishCoronaData";
import { Dispatch } from "react";
import { ThlTestData } from "../../models/ThlTestData";


export const fetchDataPending = (): AppActions => ({
  type: FETCH_DATA_PENDING,
})

export const fetchDataSuccess = (data: FinnishCoronaData): AppActions => ({
  type: FETCH_DATA_SUCCESS,
  payload: data
})

export const fetchDataError = (error: Boolean): AppActions => ({
  type: FETCH_DATA_ERROR,
  error: error
})


export const fetchHcdTestDataPending = (): AppActions => ({
  type: FETCH_HCD_TEST_DATA_PENDING
})

export const fetchHcdTestDataSuccess = (data: HcdTestData): AppActions => ({
  type: FETCH_HCD_TEST_DATA_SUCCESS,
  payload: data
})

export const fetchHcdTestDataError = (error: Boolean): AppActions => ({
  type: FETCH_HCD_TEST_DATA_ERROR,
  error: error
})


export const fetchThlTestDataPending = (): AppActions => ({
  type: FETCH_THL_TEST_DATA_PENDING
})

export const fetchThlTestDataSuccess = (data: ThlTestData): AppActions => ({
  type: FETCH_THL_TEST_DATA_SUCCESS,
  payload: data
})

export const fetchThlTestDataError = (error: Boolean): AppActions => ({
  type: FETCH_THL_TEST_DATA_ERROR,
  error: error
})

export function fetchFinnishCoronaData() {
  return async (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchDataPending());
    await fetch('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2')
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res.error);
        }

        dispatch(fetchDataSuccess(res));
        return res;
      })
      .catch(error => {
        dispatch(fetchDataError(error));
      })
  }
}

export function fetchHcdTestData() {
  return async (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchHcdTestDataPending());
    await fetch('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/hcdTestData')
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res.error);
        }

        dispatch(fetchHcdTestDataSuccess(res));
        return res;
      })
      .catch(error => {
        dispatch(fetchHcdTestDataError(error));
      })
  }
}

export function fetchThlTestData() {
  return async (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchThlTestDataPending());
    await fetch('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/thlTestData')
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res.error);
        }

        dispatch(fetchThlTestDataSuccess(res));
        return res;
      })
      .catch(error => {
        dispatch(fetchThlTestDataError(error));
      })
  }
}