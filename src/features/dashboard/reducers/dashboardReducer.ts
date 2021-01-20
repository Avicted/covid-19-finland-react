import { DashboardActions, DashboardActionTypes } from '../actions/dataActions'
import produce from 'immer'
import { subDays, isBefore, isAfter, eachDayOfInterval, getUnixTime, parseISO, formatISO } from 'date-fns'
import { Confirmed, Deaths, FinnishCoronaData, Recovered } from '../../../entities/FinnishCoronaData'
import { HcdTestData } from '../../../entities/HcdTestData'
import { ThlTestData, ThlTestDataItem } from '../../../entities/ThlTestData'
import { AppState } from '../../../framework/store/rootReducer'
import { ChartData } from '../../../entities/ChartData'
import { InfectionsByHealthCareDistrictChartData } from '../../../entities/InfectionsByHealthCareDistrictChartData'
import { TestsByHealthCareDistrictChartData } from '../../../entities/TestsByHealthCareDistrictChartData'
import { createSelector } from 'reselect'

// @Note: we are not calculating the rolling average for the past 5 days, since the data for these days 
// is still being added to by THL.
const lastDaysToIgnore: number = 5;

interface DashboardState {
    data: FinnishCoronaData | undefined
    loadingData: boolean
    loadingDataError: string | undefined
    oldestDate: Date | undefined

    hcdTestData: HcdTestData | undefined
    loadingHcdTestData: boolean
    loadingHcdTestDataError: string | undefined

    thlTestData: ThlTestData | undefined
    loadingThlTestData: boolean
    loadingThlTestDataError: string | undefined
}

const initialState: DashboardState = {
    data: undefined,
    loadingData: false,
    loadingDataError: undefined,
    oldestDate: undefined,

    hcdTestData: undefined,
    loadingHcdTestData: false,
    loadingHcdTestDataError: undefined,

    thlTestData: undefined,
    loadingThlTestData: false,
    loadingThlTestDataError: undefined,
}

export function dashboardReducer(state: DashboardState = initialState, action: DashboardActions) {
    switch (action.type) {
        case DashboardActionTypes.FetchData:
            return produce(state, (draft) => {
                draft.loadingData = true
                draft.loadingDataError = undefined
            })
        case DashboardActionTypes.FetchDataSuccess:
            return produce(state, (draft) => {
                draft.loadingData = false
                draft.data = action.data
                draft.oldestDate = getOldestDate(action.data.confirmed);
            })
        case DashboardActionTypes.FetchDataError:
            return produce(state, (draft) => {
                draft.loadingData = false
                draft.loadingDataError = action.error
            })
        case DashboardActionTypes.FetchHcdTestData:
            return produce(state, (draft) => {
                draft.loadingHcdTestData = true
                draft.loadingHcdTestDataError = undefined
            })
        case DashboardActionTypes.FetchHcdTestDataSuccess:
            return produce(state, (draft) => {
                draft.loadingHcdTestData = false
                draft.hcdTestData = action.data
            })
        case DashboardActionTypes.FetchHcdTestDataError:
            return produce(state, (draft) => {
                draft.loadingHcdTestData = false
                draft.loadingHcdTestDataError = action.error
            })
        case DashboardActionTypes.FetchTHLData:
            return produce(state, (draft) => {
                draft.loadingThlTestData = true
                draft.loadingThlTestDataError = undefined
            })
        case DashboardActionTypes.FetchTHLDataSuccess:
            return produce(state, (draft) => {
                draft.loadingThlTestData = false
                draft.thlTestData = action.data
            })
        case DashboardActionTypes.FetchTHLDataError:
            return produce(state, (draft) => {
                draft.loadingThlTestData = false
                draft.loadingThlTestDataError = action.error
            })
        default:
            return state
    }
}

export const getData = createSelector(
    (state: AppState) => state.dashboard.data,
    (data): FinnishCoronaData | undefined => data,
)

export const getLoadingData = createSelector(
    (state: AppState) => state.dashboard.loadingData,
    (loadingData): boolean => loadingData,
)

export const getLoadingDataError = createSelector(
    (state: AppState) => state.dashboard.loadingDataError,
    (loadingDataError): string | undefined => loadingDataError
)

export const getHcdTestData = createSelector(
    (state: AppState) => state.dashboard.hcdTestData,
    (hcdTestData): HcdTestData | undefined => hcdTestData,
)

export const getLoadingHcdTestData = createSelector(
    (state: AppState) => state.dashboard.loadingHcdTestData,
    (loadingHcdTestData): boolean => loadingHcdTestData,
)

export const getLoadingHcdTestDataError = createSelector(
    (state: AppState) => state.dashboard.loadingHcdTestDataError,
    (loadingHcdTestDataError): string | undefined => loadingHcdTestDataError,
)

export const getThlTestData = createSelector(
    (state: AppState) => state.dashboard.thlTestData,
    (thlTestData): ThlTestData | undefined => thlTestData,
)

export const getLoadingThlTestData = createSelector(
    (state: AppState) => state.dashboard.loadingThlTestData,
    (loadingThlTestData): boolean => loadingThlTestData,
)

export const getLoadingThlTestDataError = createSelector(
    (state: AppState) => state.dashboard.loadingThlTestDataError,
    (loadingThlTestDataError): string | undefined => loadingThlTestDataError,
)

export const getTotalRecovered = createSelector(
    (state: AppState) => state.dashboard.data?.recovered.length,
    (recovered): number | undefined => recovered,
)

export const getTotalDeaths = createSelector(
    (state: AppState) => state.dashboard.data?.deaths.length,
    (deaths): number | undefined => deaths,
)

export function getTotalInfected(state: AppState): number | undefined {
    if (state.dashboard.hcdTestData) {
        return state.dashboard.hcdTestData['Kaikki sairaanhoitopiirit']?.infected
    } else {
        return undefined
    }
}

export function getConfirmedPastSevenDays(state: AppState): number | undefined {
    const confirmedCases = getData(state)?.confirmed
    if (confirmedCases === undefined) {
        return undefined;
    }

    const confirmedCasesCount = confirmedCases.length

    if (confirmedCasesCount <= 0) {
        return undefined;
    }

    // Count the confirmed cases backwards from yesterdays date for seven days
    let confirmedCasesPastSevenDays: number = 0;

    for (let i = confirmedCases.length - 1; i > 0; i--) {
        if (isAfter(new Date(confirmedCases[i].date), subDays(new Date(), 8))) {
            confirmedCasesPastSevenDays++;
        }

        if (isBefore(new Date(confirmedCases[i].date), subDays(new Date(), 8))) {
            break;
        }
    }

    return confirmedCasesPastSevenDays;
}

export function getTotalPopulation(state: AppState): number {
    if (state.dashboard.hcdTestData) {
        return state.dashboard.hcdTestData['Kaikki sairaanhoitopiirit']?.population
    } else {
        return 0
    }
}

export function getTotalTested(state: AppState): number {
    if (state.dashboard.hcdTestData) {
        return state.dashboard.hcdTestData['Kaikki sairaanhoitopiirit']?.tested
    } else {
        return 0
    }
}

export function getPercentageOfPopulationTested(state: AppState): number | string {
    if (getTotalPopulation(state) > 0 && getTotalTested(state) > 0) {
        const percentage: number = getTotalTested(state) / getTotalPopulation(state)
        return (percentage * 100).toFixed(2)
    } else {
        return 0
    }
}

export function getConfirmedChartData(state: AppState): ChartData[] | undefined {
    const confirmed: Confirmed[] | undefined = getData(state)?.confirmed
    if (confirmed === undefined) {
        return undefined
    }

    if (confirmed.length <= 0) {
        return undefined
    }

    const data = generateMissingDates(state, confirmed)
    if (data === undefined) {
        return undefined;
    }

    let confirmedCases: ChartData[] = data.map((dataPoint: ChartData, index: number) => {
        if (index >= data.length - lastDaysToIgnore) {
            return {
                unixMilliseconds: dataPoint.unixMilliseconds,
                value: undefined,
            }
        } else {
            return {
                unixMilliseconds: dataPoint.unixMilliseconds,
                value: dataPoint.value,
            }
        }
    });

    return confirmedCases;
}

export function getConfirmedStillBeingUpdated(state: AppState): ChartData[] | undefined {
    const confirmed: Confirmed[] | undefined = getData(state)?.confirmed
    if (confirmed === undefined || confirmed.length <= lastDaysToIgnore) {
        return undefined
    }

    const data = generateMissingDates(state, confirmed)
    if (data === undefined) {
        return undefined;
    }

    let confirmedStillBeingUpdated: ChartData[] = data.map((dataPoint: ChartData, index: number) => {
        if (index >= data.length - lastDaysToIgnore) {
            return {
                unixMilliseconds: dataPoint.unixMilliseconds,
                value: dataPoint.value,
            }
        } else {
            return {
                unixMilliseconds: dataPoint.unixMilliseconds,
                value: undefined,
            }
        }
    });

    return confirmedStillBeingUpdated;
}

export function getConfirmedChartDataSevenDaysRollingAverage(state: AppState): ChartData[] | undefined {
    const confirmed: Confirmed[] | undefined = getData(state)?.confirmed
    if (confirmed === undefined) {
        return undefined
    }

    if (confirmed.length <= 0) {
        return undefined
    }

    const data = generateMissingDates(state, confirmed)
    if (data === undefined) {
        return undefined;
    }

    const sevendaysRollingAverage: ChartData[] = [];

    for (let i = 0; i < data.length; i++) {
        if (i < 6) {
            sevendaysRollingAverage.push({
                unixMilliseconds: data[i].unixMilliseconds,
                value: 0,
            });

            continue;
        }

        if (i >= data.length - lastDaysToIgnore) {
            sevendaysRollingAverage.push({
                unixMilliseconds: data[i].unixMilliseconds,
                value: undefined,
            });

            continue;
        }

        const chartDataSlice: ChartData[] = data.slice(i - 6, i);
        const valuesSlice: number[] = chartDataSlice.map((chartData) => chartData.value as number);
        const rollingAverage: number = valuesSlice.reduce((a, b) => (a + b)) / valuesSlice.length;
        sevendaysRollingAverage.push({
            unixMilliseconds: data[i].unixMilliseconds,
            value: parseFloat(rollingAverage.toPrecision(2)),
        });
    }

    return sevendaysRollingAverage;
}

export function getDeathsChartData(state: AppState): ChartData[] | undefined {
    const deaths: Deaths[] | undefined = getData(state)?.deaths
    if (deaths === undefined) {
        return undefined
    }

    if (deaths.length <= 0) {
        return undefined
    }

    const data = generateMissingDates(state, deaths)
    return data
}

export function getRecoveredChartData(state: AppState): ChartData[] | undefined {
    const recovered: Recovered[] | undefined = getData(state)?.recovered
    if (recovered === undefined) {
        return undefined
    }

    if (recovered.length <= 0) {
        return undefined
    }

    const data = generateMissingDates(state, recovered)
    return data
}

export function getTestsPerDayChartData(state: AppState): ChartData[] | undefined {
    const tested: ThlTestDataItem[] | undefined = getThlTestData(state)?.tested
    if (tested === undefined) {
        return undefined
    }

    const testedCount = tested.length

    if (testedCount <= 0) {
        return undefined
    }

    let data: ChartData[] = []
    for (let i = 0; i < testedCount; i++) {
        const datetime = tested[i].date
        const date = new Date(datetime).toISOString().substr(0, 10)
        const milliseconds = new Date(date).getTime()
        data.push({
            unixMilliseconds: milliseconds,
            value: tested[i].value,
        })
    }

    return data
}

export function getTestsPerDayChartDataCumulative(state: AppState): ChartData[] | undefined {
    const testCases: ThlTestDataItem[] | undefined = getThlTestData(state)?.tested
    if (testCases === undefined) {
        return undefined
    }

    const testCasesCount = testCases.length

    if (testCasesCount <= 0) {
        return undefined
    }

    const today: string = formatISO(Date.parse(new Date().toISOString()), { representation: 'date' });
    if (state.dashboard.oldestDate === undefined) {
        return undefined;
    }

    const oldest: string = formatISO(Date.parse(state.dashboard.oldestDate.toISOString()), { representation: 'date' });
    if (oldest === undefined) {
        return undefined;
    }

    const generatedDates: ChartData[] = []

    const dateRange: Date[] = eachDayOfInterval({
        start: Date.parse(oldest),
        end: Date.parse(today),
    })

    dateRange.forEach(date => {
        const dateString: string = formatISO(Date.parse(date.toISOString()), { representation: 'date' });
        const milliseconds: number = getUnixTime(new Date(dateString)) * 1000;
        generatedDates.push({
            unixMilliseconds: milliseconds,
            value: 0,
        })
    })

    // Assign the data to the generated dates
    for (let i = 0; i < generatedDates.length; i++) {
        const currentMilliseconds = generatedDates[i].unixMilliseconds

        for (let j = 0; j < testCasesCount; j++) {
            const datetime = testCases[j].date
            const date = new Date(datetime).toISOString().substr(0, 10)
            const milliseconds = new Date(date).getTime()

            if (currentMilliseconds === milliseconds) {
                generatedDates[i].value = generatedDates[i].value as number + testCases[j].value as number;
            }
        }

        if (i > 0) {
            generatedDates[i].value = (generatedDates[i].value as number) + (generatedDates[i - 1].value as number);
        }
    }

    return generatedDates
}

export function getConfirmedChartDataCumulative(state: AppState): ChartData[] | undefined {
    const confirmed: Confirmed[] | undefined = getData(state)?.confirmed
    if (confirmed === undefined) {
        return undefined
    }

    if (confirmed.length <= 0) {
        return undefined
    }

    const data = generateMissingDates(state, confirmed, true)
    return data
}

export function getDeathsChartDataCumulative(state: AppState): ChartData[] | undefined {
    const deaths: Deaths[] | undefined = getData(state)?.deaths
    if (deaths === undefined) {
        return undefined
    }

    if (deaths.length <= 0) {
        return undefined
    }

    const data = generateMissingDates(state, deaths, true)
    return data
}

export function getRecoveredChartDataCumulative(state: AppState): ChartData[] | undefined {
    const recovered: Recovered[] | undefined = getData(state)?.recovered
    if (recovered === undefined) {
        return undefined
    }

    if (recovered.length <= 0) {
        return undefined
    }

    const data = generateMissingDates(state, recovered, true)
    return data
}

export function getInfectionsByHealthCareDistrictChartData(state: AppState): InfectionsByHealthCareDistrictChartData[] | undefined {
    const confirmedCases: Confirmed[] | undefined = getData(state)?.confirmed
    if (confirmedCases === undefined) {
        return undefined
    }

    const confirmedCasesCount = confirmedCases.length

    if (confirmedCasesCount <= 0) {
        return undefined
    }

    const casesPerHealthCareDistrict: string | any[] = []

    for (let i = 0; i < confirmedCasesCount; i++) {
        let found = false

        for (let j = 0; j < casesPerHealthCareDistrict.length; j++) {
            if (confirmedCases[i].healthCareDistrict === undefined) {
                confirmedCases[i].healthCareDistrict = 'Unknown'
            }

            if (confirmedCases[i].healthCareDistrict === casesPerHealthCareDistrict[j].healthCareDistrict) {
                found = true
                casesPerHealthCareDistrict[j].count = casesPerHealthCareDistrict[j].count + 1
                break
            }
        }

        if (!found) {
            casesPerHealthCareDistrict.push({
                healthCareDistrict: confirmedCases[i].healthCareDistrict,
                count: 1,
            })
        }
    }

    // Add the count to the name of the healthCareDistrict
    const generatedLabels: string[] = []
    const series: number[] = []

    for (let i = 0; i < casesPerHealthCareDistrict.length; i++) {
        const healthCareDistrict = casesPerHealthCareDistrict[i].healthCareDistrict
        const count = casesPerHealthCareDistrict[i].count

        casesPerHealthCareDistrict[i].healthCareDistrict = `${healthCareDistrict}`
        generatedLabels.push(casesPerHealthCareDistrict[i].healthCareDistrict)
        series.push(count)
    }

    let result: InfectionsByHealthCareDistrictChartData[] = []
    for (let i = 0; i < generatedLabels.length; i++) {
        const newDataSeries = {
            name: generatedLabels[i],
            data: series[i],
        }

        result.push(newDataSeries)
    }

    result.sort((a, b) => a.name.localeCompare(b.name))
    return result;
}

export function getTestsPerHealthCareDistrictChartData(state: AppState): TestsByHealthCareDistrictChartData[] | undefined {
    const healthCareDistrictData = getHcdTestData(state)

    if (healthCareDistrictData === undefined) {
        return undefined
    }

    let result: TestsByHealthCareDistrictChartData[] = [];
    for (const district in healthCareDistrictData) {
        if (district === 'Kaikki sairaanhoitopiirit') {
            continue
        }

        const newDataSeries = {
            name: district,
            data: healthCareDistrictData[district].tested,
        }

        result.push(newDataSeries)
    }

    result.sort((a, b) => a.name.localeCompare(b.name))
    return result;
}

function getOldestDate(confirmed: Confirmed[]): Date | undefined {
    if (confirmed === undefined) {
        return undefined
    }

    const confirmedCasesCount = confirmed.length
    let oldestDate: string = new Date().toISOString();

    for (let i = 0; i < confirmedCasesCount; i++) {
        const datetime = confirmed[i].date
        if (Date.parse(datetime) < Date.parse(oldestDate)) {
            oldestDate = datetime
        }
    }

    return parseISO(oldestDate);
}

function generateMissingDates(state: AppState, data: Confirmed[] | Deaths[] | Recovered[], cumulative: boolean = false): ChartData[] | undefined {
    const cases = data
    const casesCount = data.length
    const casesByDay: ChartData[] = []

    for (let i = 0; i < casesCount; i++) {
        const date: string = formatISO(Date.parse(cases[i].date), { representation: 'date' });
        const milliseconds: number = getUnixTime(new Date(date)) * 1000;

        // Is the current date already stored? If so, increment the case count
        const datesToProcess = casesByDay.length
        let dateAlreadyProcessed = false

        for (let i = 0; i < datesToProcess; i++) {
            const currentMilliseconds = casesByDay[i].unixMilliseconds

            if (currentMilliseconds === milliseconds) {
                casesByDay[i].value = casesByDay[i].value as number + 1
                dateAlreadyProcessed = true
                break
            }
        }

        // If not store it
        if (!dateAlreadyProcessed) {
            casesByDay.push({
                unixMilliseconds: milliseconds,
                value: 1,
            })
        }
    }

    // Generate missing dates
    const today: string = formatISO(Date.parse(new Date().toISOString()), { representation: 'date' });
    if (state.dashboard.oldestDate === undefined) {
        return undefined;
    }

    const oldest: string = formatISO(Date.parse(state.dashboard.oldestDate.toISOString()), { representation: 'date' });
    if (oldest === undefined) {
        return undefined;
    }

    const generatedDates: ChartData[] = []

    const dateRange: Date[] = eachDayOfInterval({
        start: Date.parse(oldest),
        end: Date.parse(today),
    })

    dateRange.forEach(date => {
        const dateString: string = formatISO(Date.parse(date.toISOString()), { representation: 'date' });
        const milliseconds: number = getUnixTime(new Date(dateString)) * 1000;
        generatedDates.push({
            unixMilliseconds: milliseconds,
            value: 0,
        })
    });

    // Assign the data to the generated dates
    for (let i = 0; i < generatedDates.length; i++) {
        let caseFoundOnDate = false

        for (let j = 0; j < casesByDay.length; j++) {
            const currentCaseDate: number = casesByDay[j].unixMilliseconds

            if (currentCaseDate === generatedDates[i].unixMilliseconds) {
                caseFoundOnDate = true

                if (cumulative) {
                    if (i > 0) {
                        generatedDates[i].value = (generatedDates[i].value as number) + (generatedDates[i - 1].value as number) + (casesByDay[j].value as number);
                    } else {
                        generatedDates[i].value = (generatedDates[i].value as number) + (casesByDay[j].value as number);
                    }
                } else {
                    generatedDates[i].value = (generatedDates[i].value as number) + (casesByDay[j].value as number);
                }
            }
        }

        if (cumulative) {
            if (i > 0 && !caseFoundOnDate) {
                generatedDates[i].value = (generatedDates[i].value as number) + (generatedDates[i - 1].value as number);
            }
        }
    }

    return generatedDates
}
