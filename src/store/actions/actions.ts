export const FETCH_DATA_PENDING = 'FETCH_DATA_PENDING';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_ERROR = 'FETCH_DATA_ERROR';

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

export function fetchData() {
  return async (dispatch: any) => {
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