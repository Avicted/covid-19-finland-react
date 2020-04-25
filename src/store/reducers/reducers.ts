import {
  FETCH_DATA_PENDING,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_ERROR
} from '../actions/actions';
import { combineReducers } from 'redux';

const initialState = {
  pending: false,
  data: null,
  error: null
}

export function dataReducer(state = initialState, action: any) {
  switch (action.type) {
    case FETCH_DATA_PENDING:
      return {
        ...state,
        pending: true
      }
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        pending: false,
        data: action.payload
      }
    case FETCH_DATA_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error
      }
    default:
      return state;
  }
}

export const getData = (state: { data: any; }) => state.data;
export const getDataPending = (state: { pending: any; }) => state.pending;
export const getDataError = (state: { error: any; }) => state.error;

const rootReducer = combineReducers({
  dataReducer,
})

export default rootReducer