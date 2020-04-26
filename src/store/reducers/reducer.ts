import { HcdTestData } from '../../models/HcdTestData';
import { DataActionTypes } from '../../models/actions';

export type State = {
  readonly finnishCoronaDataPending: Boolean;
  readonly finnishCoronaData: any;
  readonly hcdTestDataPending: Boolean;
  readonly hcdTestData: HcdTestData;
  readonly error: Boolean;
};

const initialState: State = {
  finnishCoronaDataPending: false,
  finnishCoronaData: null,
  hcdTestDataPending: false,
  hcdTestData: {},
  error: false
}

// @TODO: add a return type to 
// const dataReducer = (state = initialState, action: DataActionTypes): TYPE_HERE[] => {

const dataReducer = (state = initialState, action: DataActionTypes) => {
  switch (action.type) {
    case "FETCH_DATA_PENDING":
      return {
        ...state,
        finnishCoronaDataPending: true
      }
    case "FETCH_DATA_SUCCESS":
      return {
        ...state,
        pending: false,
        finnishCoronaData: action.payload
      }
    case "FETCH_DATA_ERROR":
      return {
        ...state,
        pending: false,
        error: action.error
      }
    case "FETCH_HCD_TEST_DATA_PENDING":
      return {
        ...state,
        hcdTestDataPending: true
      }
    case "FETCH_HCD_TEST_DATA_SUCCESS":
      return {
        ...state,
        pending: false,
        hcdTestData: action.payload
      }
    case "FETCH_HCD_TEST_DATA_ERROR":
      return {
        ...state,
        pending: false,
        error: action.error
      }
    default:
      return state;
  }
}

export { dataReducer }

export const getFinnishCoronaData = (state: { finnishCoronaData: any; }) => state.finnishCoronaData;
export const getHcdTestData = (state: { hcdTestData: any; }) => state.hcdTestData;
export const getFinnishCoronaDataPending = (state: { finnishCoronaDataPending: Boolean; }) => state.finnishCoronaDataPending;
export const getHcdTestDataPending = (state: { finnishCoronaDataPending: Boolean; }) => state.finnishCoronaDataPending;
export const getDataError = (state: { error: Boolean; }) => state.error;