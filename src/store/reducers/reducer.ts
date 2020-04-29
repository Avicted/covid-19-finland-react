import { HcdTestData } from '../../models/HcdTestData';
import { DataActionTypes } from '../../models/actions';
import { FinnishCoronaData } from '../../models/FinnishCoronaData';

export type State = {
  readonly finnishCoronaDataPending: Boolean;
  readonly finnishCoronaData: FinnishCoronaData;
  readonly hcdTestDataPending: Boolean;
  readonly hcdTestData: HcdTestData;
  readonly error: Boolean;
};

const initialState: State = {
  finnishCoronaDataPending: false,
  finnishCoronaData: {
    confirmed: [],
    deaths: [],
    recovered: []
  },
  hcdTestDataPending: false,
  hcdTestData: {},
  error: false
}

export const dataReducer = (state = initialState, action: DataActionTypes) => {
  switch (action.type) {
    case "FETCH_DATA_PENDING":
      return {
        ...state,
        finnishCoronaDataPending: true
      }
    case "FETCH_DATA_SUCCESS":
      return {
        ...state,
        finnishCoronaDataPending: false,
        finnishCoronaData: action.payload
      }
    case "FETCH_DATA_ERROR":
      return {
        ...state,
        finnishCoronaDataPending: false,
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
        hcdTestDataPending: false,
        hcdTestData: action.payload
      }
    case "FETCH_HCD_TEST_DATA_ERROR":
      return {
        ...state,
        hcdTestDataPending: false,
        error: action.error
      }
    default:
      return state;
  }
}

export const getFinnishCoronaData = (state: State) => state.finnishCoronaData;
export const getHcdTestData = (state: State) => state.hcdTestData;
export const getFinnishCoronaDataPending = (state: State) => state.finnishCoronaDataPending;
export const getHcdTestDataPending = (state: State) => state.finnishCoronaDataPending;
export const getDataError = (state: State) => state.error;

export const getTotalInfected = (state: State): number => state.hcdTestData["Kaikki sairaanhoitopiirit"]?.infected;
export const getTotalPopulation = (state: State): number => state.hcdTestData["Kaikki sairaanhoitopiirit"]?.population;
export const getTotalTested = (state: State): number => state.hcdTestData["Kaikki sairaanhoitopiirit"]?.tested;


export const getPercentageOfPopulationTested = (state: State) => {
  if (getTotalPopulation(state) > 0 && getTotalTested(state) > 0) {
    const percentage: number = getTotalTested(state) / getTotalPopulation(state);
    return (percentage * 100).toFixed(2);
  } else {
    return 0;
  }
}

export const getConfirmedChartData = (state: State) => {
  const confirmed = getFinnishCoronaData(state).confirmed

  if (confirmed.length <= 0) {
    return null;
  }

  // @TODO: research typescript Record
  let chartDataMap: Map<any, any> = new Map()

  for (let i = 0; i < confirmed.length; i++) {
    const element = confirmed[i];
    const timestamp = new Date(element.date).getTime()

    if (chartDataMap.has(timestamp)) {
      chartDataMap.get(timestamp).value++
    } else {
      chartDataMap.set(timestamp, { value: 1, time: timestamp })
    }
  }

  let chartDataArray: { time: number, value: number }[] = [];
  chartDataMap.forEach(element => chartDataArray.push(element))
  
  const sortedChartDataArray = chartDataArray.sort(function(x, y){
      return x.time - y.time;
  });

  return sortedChartDataArray;
}

export const getDeathsChartData = (state: State) => {
  const deaths = getFinnishCoronaData(state).deaths

  if (deaths.length <= 0) {
    return null;
  }

  // @TODO: research typescript Record
  let chartDataMap: Map<any, any> = new Map()

  for (let i = 0; i < deaths.length; i++) {
    const element = deaths[i];
    const timestamp = new Date(element.date).getTime()

    if (chartDataMap.has(timestamp)) {
      chartDataMap.get(timestamp).value++
    } else {
      chartDataMap.set(timestamp, { value: 1, time: timestamp })
    }
  }

  let chartDataArray: { time: number, value: number }[] = [];
  chartDataMap.forEach(element => chartDataArray.push(element))

  const sortedChartDataArray = chartDataArray.sort(function(x, y){
      return x.time - y.time;
  });

  return sortedChartDataArray;
}