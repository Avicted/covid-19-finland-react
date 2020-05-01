import { HcdTestData } from '../../models/HcdTestData';
import { DataActionTypes } from '../../models/actions';
import { FinnishCoronaData } from '../../models/FinnishCoronaData';
import { ThlTestData } from '../../models/ThlTestData';
import moment from 'moment';

export type State = {
  readonly finnishCoronaDataPending: Boolean;
  readonly finnishCoronaData: FinnishCoronaData;
  readonly hcdTestDataPending: Boolean;
  readonly hcdTestData: HcdTestData;
  readonly thlTestDataPending: Boolean;
  readonly thlTestData: ThlTestData;
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
  thlTestDataPending: false,
  thlTestData: {
    tested: []
  },
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
    case "FETCH_THL_TEST_DATA_PENDING":
      return {
        ...state,
        thlTestDataPending: true
      }
    case "FETCH_THL_TEST_DATA_SUCCESS":
      return {
        ...state,
        thlTestDataPending: false,
        thlTestData: action.payload
      }
    case "FETCH_THL_TEST_DATA_ERROR":
      return {
        ...state,
        thlTestDataPending: false,
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

export const getTotalRecovered = (state: State): number => state.finnishCoronaData?.recovered.length;
export const getTotalDeaths = (state: State): number => state.finnishCoronaData?.deaths.length;

export const getTotalInfected = (state: State): number => state.hcdTestData["Kaikki sairaanhoitopiirit"]?.infected;
export const getTotalPopulation = (state: State): number => state.hcdTestData["Kaikki sairaanhoitopiirit"]?.population;
export const getTotalTested = (state: State): number => state.hcdTestData["Kaikki sairaanhoitopiirit"]?.tested;

export const getThlTestData = (state: State) => state.thlTestData;


export const getChangeToday = (state: State): string => {
  const confirmedCases = getFinnishCoronaData(state).confirmed
  const confirmedCasesCount = confirmedCases.length;

  if (confirmedCasesCount <= 0) {
    return '';
  }

  const confirmedCasesByDay: any = [];

  const generatedDates: [number, number][] = [];
  const todaysDate = new Date().toISOString();
  let oldestDate = new Date().toISOString();

  for (let i = 0; i < confirmedCasesCount; i++) {
    const datetime = confirmedCases[i].date;
    const date = new Date(datetime).toISOString().substr(0, 10);
    const milliseconds = new Date(date).getTime();

    if (Date.parse(datetime) < Date.parse(oldestDate)) {
      oldestDate = datetime;
    }

    // Is the current date already stored? If so, increment the case count
    const processedDatesCount = confirmedCasesByDay.length;
    let dateAlreadyProcessed = false;

    for (let i = 0; i < processedDatesCount; i++) {
      const currentMilliseconds = confirmedCasesByDay[i][0];

      if (currentMilliseconds === milliseconds) {
        confirmedCasesByDay[i][1] = confirmedCasesByDay[i][1] + 1;
        dateAlreadyProcessed = true;
        break;
      }
    }

    // If not store it
    if (!dateAlreadyProcessed) {
      confirmedCasesByDay.push([milliseconds, 1]);
    }
  }

  // Generate missing dates
  const today = moment(todaysDate).format("YYYY-MM-DD");
  const oldest = moment(oldestDate).format("YYYY-MM-DD");

  for (let m = moment(oldest); m.isSameOrBefore(today); m.add(1, "days")) {
    const currentMilliseconds = new Date(m.format("YYYY-MM-DD")).getTime();
    generatedDates.push([currentMilliseconds, 0]);
  }

  // Assign the data to the generated dates
  for (let i = 0; i < generatedDates.length; i++) {
    for (let j = 0; j < confirmedCasesByDay.length; j++) {
      const currentCaseDate = confirmedCasesByDay[j][0];
      if (currentCaseDate === generatedDates[i][0]) {
        generatedDates[i][1] =
          generatedDates[i][1] + confirmedCasesByDay[j][1];
      }
    }
  }

  // Calculate the increase in cases today compared to yesterday
  const casesToday = generatedDates[generatedDates.length - 1][1];
  const casesYesterday = generatedDates[generatedDates.length - 2][1];
  const total = casesToday - casesYesterday;
  let increaseToday: string = '';

  if (total > 0) {
    increaseToday = `+ ${casesToday - casesYesterday}`;
  } else if (total > 0) {
    increaseToday = `- ${casesToday - casesYesterday}`;
  } else {
    increaseToday = `${casesToday - casesYesterday}`;
  }

  return increaseToday;
}

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

  const data = generateMissingDates(state, confirmed)
  return data;
}

export const getDeathsChartData = (state: State) => {
  const deaths = getFinnishCoronaData(state).deaths

  if (deaths.length <= 0) {
    return null;
  }

  const data = generateMissingDates(state, deaths)
  return data;
}

export const getRecoveredChartData = (state: State) => {
  const recovered = getFinnishCoronaData(state).recovered

  if (recovered.length <= 0) {
    return null;
  }

  const data = generateMissingDates(state, recovered)
  return data;
}


export const getTestsPerDayChartData = (state: State) => {
  const tested = getThlTestData(state).tested
  const testedCount = tested.length

  if (testedCount <= 0) {
    return null;
  }

  let data: [number, number][] = [];
  for (let i = 0; i < testedCount; i++) {
    const datetime = tested[i].date;
    const date = new Date(datetime).toISOString().substr(0, 10);
    const milliseconds = new Date(date).getTime();
    data.push([milliseconds, tested[i].value])
  }

  return data
}

export const getTestsPerDayChartDataCumulative = (state: State) => {
  const testCases = getThlTestData(state).tested
  const testCasesCount = testCases.length

  if (testCasesCount <= 0) {
    return null;
  }

  const todaysDate = new Date().toISOString();
  const today = moment(todaysDate).format("YYYY-MM-DD");
  const oldest = getOldestDate(state)
  const generatedDates: [number, number][] = [];

  for (let m = moment(oldest); m.isSameOrBefore(today); m.add(1, "days")) {
    const currentMilliseconds = new Date(
      m.format("YYYY-MM-DD")
    ).getTime();
    generatedDates.push([currentMilliseconds, 0]);
  }

  // Assign the data to the generated dates
  for (let i = 0; i < generatedDates.length; i++) {
    const currentMilliseconds = generatedDates[i][0];

    for (let j = 0; j < testCasesCount; j++) {
      const datetime = testCases[j].date;
      const date = new Date(datetime).toISOString().substr(0, 10);
      const milliseconds = new Date(date).getTime();

      if (currentMilliseconds === milliseconds) {
        generatedDates[i][1] = generatedDates[i][1] + testCases[j].value;
      }
    }

    if (i > 0) {
      generatedDates[i][1] = generatedDates[i][1] + generatedDates[i - 1][1];
    }
  }

  return generatedDates;
}

export const getConfirmedChartDataCumulative = (state: State) => {
  const confirmed = getFinnishCoronaData(state).confirmed

  if (confirmed.length <= 0) {
    return null;
  }

  const data = generateMissingDates(state, confirmed, true)
  return data;
}

export const getDeathsChartDataCumulative = (state: State) => {
  const deaths = getFinnishCoronaData(state).deaths

  if (deaths.length <= 0) {
    return null;
  }

  const data = generateMissingDates(state, deaths, true)
  return data;
}

export const getRecoveredChartDataCumulative = (state: State) => {
  const recovered = getFinnishCoronaData(state).recovered

  if (recovered.length <= 0) {
    return null;
  }

  const data = generateMissingDates(state, recovered, true)
  return data;
}

function getOldestDate(state: State): string {
  const confirmed = getFinnishCoronaData(state).confirmed
  const confirmedCasesCount = confirmed.length;
  let oldestDate = new Date().toISOString();

  for (let i = 0; i < confirmedCasesCount; i++) {
    const datetime = confirmed[i].date;
    if (Date.parse(datetime) < Date.parse(oldestDate)) {
      oldestDate = datetime;
    }
  }

  return oldestDate
}

function generateMissingDates(state: State, data: any, cumulative: boolean = false): [number, number][] {
  const cases = data;
  const casesCount = data.length;
  const casesByDay: [number, number][] = [];

  const generatedDates: [number, number][] = [];
  const todaysDate = new Date().toISOString();
  let oldestDate = getOldestDate(state)

  for (let i = 0; i < casesCount; i++) {
    const datetime = cases[i].date;
    const date = new Date(datetime).toISOString().substr(0, 10);
    const milliseconds = new Date(date).getTime();

    // Is the current date already stored? If so, increment the case count
    const processedDatesCount = casesByDay.length;
    let dateAlreadyProcessed = false;

    for (let i = 0; i < processedDatesCount; i++) {
      const currentMilliseconds = casesByDay[i][0];

      if (currentMilliseconds === milliseconds) {
        casesByDay[i][1] = casesByDay[i][1] + 1;
        dateAlreadyProcessed = true;
        break;
      }
    }

    // If not store it
    if (!dateAlreadyProcessed) {
      casesByDay.push([milliseconds, 1]);
    }
  }

  // Generate missing dates
  const today = moment(todaysDate).format("YYYY-MM-DD");
  const oldest = moment(oldestDate).format("YYYY-MM-DD");

  for (let m = moment(oldest); m.isSameOrBefore(today); m.add(1, "days")) {
    const currentMilliseconds = new Date(
      m.format("YYYY-MM-DD")
    ).getTime();
    generatedDates.push([currentMilliseconds, 0]);
  }

  // Assign the data to the generated dates
  for (let i = 0; i < generatedDates.length; i++) {
    let caseFoundOnDate = false;

    for (let j = 0; j < casesByDay.length; j++) {
      const currentCaseDate = casesByDay[j][0];
      if (currentCaseDate === generatedDates[i][0]) {
        caseFoundOnDate = true;

        if (cumulative) {
          if (i > 0) {
            generatedDates[i][1] = generatedDates[i][1] + generatedDates[i - 1][1] + casesByDay[j][1];
          } else {
            generatedDates[i][1] = generatedDates[i][1] + casesByDay[j][1];
          }
        } else {
          generatedDates[i][1] = generatedDates[i][1] + casesByDay[j][1];
        }
      }
    }

    if (cumulative) {
      if (i > 0 && !caseFoundOnDate) {
        generatedDates[i][1] = generatedDates[i][1] + generatedDates[i - 1][1];
      }
    }
  }

  return generatedDates;
}