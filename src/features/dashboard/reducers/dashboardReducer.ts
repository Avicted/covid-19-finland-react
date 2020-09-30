import { DashboardActions, DashboardActionTypes } from '../actions/dataActions'
import produce from 'immer'
import moment from 'moment'
import { Confirmed, Deaths, FinnishCoronaData, Recovered } from '../../../entities/FinnishCoronaData'
import { HcdTestData } from '../../../entities/HcdTestData'
import { ThlTestData, ThlTestDataItem } from '../../../entities/ThlTestData'
import { AppState } from '../../../framework/store/rootReducer'
import { ChartData } from '../../../entities/ChartData'

// @Note: we are not calculating the rolling average for the past 5 days, since the data for these days 
// is still being added to by THL.
const lastDaysToIgnore: number = 5;

interface DashboardState {
    data: FinnishCoronaData | undefined
    loadingData: boolean
    loadingDataError: string | undefined

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

export function getData(state: AppState): FinnishCoronaData | undefined {
    return state.dashboard.data
}

export function getLoadingData(state: AppState): boolean {
    return state.dashboard.loadingData
}

export function getLoadingDataError(state: AppState): string | undefined {
    return state.dashboard.loadingDataError
}

export function getHcdTestData(state: AppState): HcdTestData | undefined {
    return state.dashboard.hcdTestData
}

export function getLoadingHcdTestData(state: AppState): boolean {
    return state.dashboard.loadingHcdTestData
}

export function getLoadingHcdTestDataError(state: AppState): string | undefined {
    return state.dashboard.loadingHcdTestDataError
}

export function getThlTestData(state: AppState): ThlTestData | undefined {
    return state.dashboard.thlTestData
}

export function getLoadingThlTestData(state: AppState): boolean {
    return state.dashboard.loadingThlTestData
}

export function getLoadingThlTestDataError(state: AppState): string | undefined {
    return state.dashboard.loadingThlTestDataError
}

export function getTotalRecovered(state: AppState): number | undefined {
    return state.dashboard.data?.recovered.length
}

export function getTotalDeaths(state: AppState): number | undefined {
    return state.dashboard.data?.deaths.length
}

export function getTotalInfected(state: AppState): number | undefined {
    if (state.dashboard.hcdTestData) {
        return state.dashboard.hcdTestData['Kaikki sairaanhoitopiirit']?.infected
    } else {
        return undefined
    }
}

export function getChangeToday(state: AppState): string {
    const confirmedCases = getData(state)?.confirmed
    if (confirmedCases === undefined) {
        return ''
    }

    const confirmedCasesCount = confirmedCases.length

    if (confirmedCasesCount <= 0) {
        return ''
    }

    const confirmedCasesByDay: any = []

    const generatedDates: ChartData[] = []
    const todaysDate = new Date().toISOString()
    let oldestDate = new Date().toISOString()

    for (let i = 0; i < confirmedCasesCount; i++) {
        const datetime = confirmedCases[i].date
        const date = new Date(datetime).toISOString().substr(0, 10)
        const milliseconds = new Date(date).getTime()

        if (Date.parse(datetime) < Date.parse(oldestDate)) {
            oldestDate = datetime
        }

        // Is the current date already stored? If so, increment the case count
        const processedDatesCount = confirmedCasesByDay.length
        let dateAlreadyProcessed = false

        for (let i = 0; i < processedDatesCount; i++) {
            const currentMilliseconds = confirmedCasesByDay[i][0]

            if (currentMilliseconds === milliseconds) {
                confirmedCasesByDay[i][1] = confirmedCasesByDay[i][1] + 1
                dateAlreadyProcessed = true
                break
            }
        }

        // If not store it
        if (!dateAlreadyProcessed) {
            confirmedCasesByDay.push([milliseconds, 1])
        }
    }

    // Generate missing dates
    const today = moment(todaysDate).format('YYYY-MM-DD')
    const oldest = moment(oldestDate).format('YYYY-MM-DD')

    for (let m = moment(oldest); m.isSameOrBefore(today); m.add(1, 'days')) {
        const currentMilliseconds = new Date(m.format('YYYY-MM-DD')).getTime()
        generatedDates.push({
            unixMilliseconds: currentMilliseconds,
            value: 0,
        });
    }

    // Assign the data to the generated dates
    for (let i = 0; i < generatedDates.length; i++) {
        for (let j = 0; j < confirmedCasesByDay.length; j++) {
            const currentCaseDate = confirmedCasesByDay[j][0]
            if (currentCaseDate === generatedDates[i].unixMilliseconds) {
                generatedDates[i].value = generatedDates[i].value + confirmedCasesByDay[j][1]
            }
        }
    }

    // Calculate the increase in cases today compared to yesterday
    const casesToday = generatedDates[generatedDates.length - 1].value as number;
    const casesYesterday = generatedDates[generatedDates.length - 2].value as number;
    const total = casesToday - casesYesterday
    let increaseToday: string = ''

    if (total > 0) {
        increaseToday = `+ ${casesToday - casesYesterday}`
    } else if (total > 0) {
        increaseToday = `- ${casesToday - casesYesterday}`
    } else {
        increaseToday = `${casesToday - casesYesterday}`
    }

    return increaseToday
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

    let confirmedCases: ChartData[] = data.map((dataPoint: ChartData, index: number) => {
        if (index >= data.length - lastDaysToIgnore) {
            return {
                unixMilliseconds: dataPoint.unixMilliseconds,
                value: null,
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

    let confirmedStillBeingUpdated: ChartData[] = data.map((dataPoint: ChartData, index: number) => {
        if (index >= data.length - lastDaysToIgnore) {
            return {
                unixMilliseconds: dataPoint.unixMilliseconds,
                value: dataPoint.value,
            }
        } else {
            return {
                unixMilliseconds: dataPoint.unixMilliseconds,
                value: null,
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
                value: null,
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

    const todaysDate = new Date().toISOString()
    const today = moment(todaysDate).format('YYYY-MM-DD')
    const oldest = getOldestDate(state)
    const generatedDates: ChartData[] = []

    for (let m = moment(oldest); m.isSameOrBefore(today); m.add(1, 'days')) {
        const currentMilliseconds = new Date(m.format('YYYY-MM-DD')).getTime()
        generatedDates.push({
            unixMilliseconds: currentMilliseconds, 
            value: 0,
        })
    }

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

export function getInfectionsByHealthCareDistrictChartData(state: AppState): any {
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

    let generatedSeries: any = []
    for (let i = 0; i < generatedLabels.length; i++) {
        const newDataSeries = {
            name: generatedLabels[i],
            data: [series[i]],
        }

        generatedSeries.push(newDataSeries)
    }

    return {
        labels: generatedLabels,
        series: generatedSeries,
    }
}

export function getTestsPerHealthCareDistrictChartData(state: AppState): any {
    const healthCareDistrictData = getHcdTestData(state)

    if (healthCareDistrictData === undefined) {
        return undefined
    }

    let generatedLabels: string[] = []
    let generatedSeries: any[] = []
    for (const district in healthCareDistrictData) {
        if (district === 'Kaikki sairaanhoitopiirit') {
            continue
        }

        const districtName = district
        const districtTestCases = healthCareDistrictData[district].tested
        const newDataSeries = {
            name: districtName,
            data: [districtTestCases],
        }

        generatedLabels.push(districtName)
        generatedSeries.push(newDataSeries)
    }

    return {
        labels: generatedLabels,
        series: generatedSeries,
    }
}

function getOldestDate(state: AppState): string | undefined {
    const confirmed: Confirmed[] | undefined = getData(state)?.confirmed
    if (confirmed === undefined) {
        return undefined
    }

    const confirmedCasesCount = confirmed.length
    let oldestDate = new Date().toISOString()

    for (let i = 0; i < confirmedCasesCount; i++) {
        const datetime = confirmed[i].date
        if (Date.parse(datetime) < Date.parse(oldestDate)) {
            oldestDate = datetime
        }
    }

    return oldestDate
}

function generateMissingDates(state: AppState, data: any, cumulative: boolean = false): ChartData[] {
    const cases = data
    const casesCount = data.length
    const casesByDay: ChartData[] = []

    const generatedDates: ChartData[] = []
    const todaysDate = new Date().toISOString()
    let oldestDate = getOldestDate(state)

    for (let i = 0; i < casesCount; i++) {
        const datetime = cases[i].date
        const date = new Date(datetime).toISOString().substr(0, 10)
        const milliseconds = new Date(date).getTime()

        // Is the current date already stored? If so, increment the case count
        const processedDatesCount = casesByDay.length
        let dateAlreadyProcessed = false

        for (let i = 0; i < processedDatesCount; i++) {
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
    const today = moment(todaysDate).format('YYYY-MM-DD')
    const oldest = moment(oldestDate).format('YYYY-MM-DD')

    for (let m = moment(oldest); m.isSameOrBefore(today); m.add(1, 'days')) {
        const currentMilliseconds = new Date(m.format('YYYY-MM-DD')).getTime()
        generatedDates.push({
            unixMilliseconds: currentMilliseconds, 
            value: 0,
        })
    }

    // Assign the data to the generated dates
    for (let i = 0; i < generatedDates.length; i++) {
        let caseFoundOnDate = false

        for (let j = 0; j < casesByDay.length; j++) {
            const currentCaseDate = casesByDay[j].unixMilliseconds
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
