export const FETCH_DATA_PENDING = 'FETCH_PRODUCTS_PENDING';
export const FETCH_DATA_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_DATA_ERROR = 'FETCH_PRODUCTS_ERROR';

export function fetchDataPending() {
  return {
    type: FETCH_DATA_PENDING
  }
}

export function fetchDataSuccess(data: any) {
  return {
    type: FETCH_DATA_SUCCESS,
    data: data
  }
}

export function fetchDataError(error: any) {
  return {
    type: FETCH_DATA_ERROR,
    error: error
  }
}

function fetchData() {
  return (dispatch: (arg0: { type: string; data?: any; error?: any; }) => void) => {
    dispatch(fetchDataPending());
    fetch('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2')
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        dispatch(fetchDataSuccess(res.data));
        return res.data;
      })
      .catch(error => {
        dispatch(fetchDataError(error));
      })
  }
}

export default fetchData;