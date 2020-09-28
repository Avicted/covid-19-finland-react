import { DashboardActions, DashboardActionTypes } from '../actions/dataActions'
import produce from 'immer'
import moment from 'moment'
import { Confirmed, Deaths, FinnishCoronaData, Recovered } from '../../../entities/FinnishCoronaData'
import { HcdTestData } from '../../../entities/HcdTestData'
import { ThlTestData, ThlTestDataItem } from '../../../entities/ThlTestData'
import { AppState } from '../../../framework/store/rootReducer'

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

    const generatedDates: [number, number][] = []
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
        generatedDates.push([currentMilliseconds, 0])
    }

    // Assign the data to the generated dates
    for (let i = 0; i < generatedDates.length; i++) {
        for (let j = 0; j < confirmedCasesByDay.length; j++) {
            const currentCaseDate = confirmedCasesByDay[j][0]
            if (currentCaseDate === generatedDates[i][0]) {
                generatedDates[i][1] = generatedDates[i][1] + confirmedCasesByDay[j][1]
            }
        }
    }

    // Calculate the increase in cases today compared to yesterday
    const casesToday = generatedDates[generatedDates.length - 1][1]
    const casesYesterday = generatedDates[generatedDates.length - 2][1]
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

export function getConfirmedChartData(state: AppState): [number, number][] | undefined {
    const confirmed: Confirmed[] | undefined = getData(state)?.confirmed
    if (confirmed === undefined) {
        return undefined
    }

    if (confirmed.length <= 0) {
        return undefined
    }

    const data = generateMissingDates(state, confirmed)
    return data
}

export function getDeathsChartData(state: AppState): [number, number][] | undefined {
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

export function getRecoveredChartData(state: AppState): [number, number][] | undefined {
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

export function getTestsPerDayChartData(state: AppState): [number, number][] | undefined {
    const tested: ThlTestDataItem[] | undefined = getThlTestData(state)?.tested
    if (tested === undefined) {
        return undefined
    }

    const testedCount = tested.length

    if (testedCount <= 0) {
        return undefined
    }

    let data: [number, number][] = []
    for (let i = 0; i < testedCount; i++) {
        const datetime = tested[i].date
        const date = new Date(datetime).toISOString().substr(0, 10)
        const milliseconds = new Date(date).getTime()
        data.push([milliseconds, tested[i].value])
    }

    return data
}

export function getTestsPerDayChartDataCumulative(state: AppState): [number, number][] | undefined {
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
    const generatedDates: [number, number][] = []

    for (let m = moment(oldest); m.isSameOrBefore(today); m.add(1, 'days')) {
        const currentMilliseconds = new Date(m.format('YYYY-MM-DD')).getTime()
        generatedDates.push([currentMilliseconds, 0])
    }

    // Assign the data to the generated dates
    for (let i = 0; i < generatedDates.length; i++) {
        const currentMilliseconds = generatedDates[i][0]

        for (let j = 0; j < testCasesCount; j++) {
            const datetime = testCases[j].date
            const date = new Date(datetime).toISOString().substr(0, 10)
            const milliseconds = new Date(date).getTime()

            if (currentMilliseconds === milliseconds) {
                generatedDates[i][1] = generatedDates[i][1] + testCases[j].value
            }
        }

        if (i > 0) {
            generatedDates[i][1] = generatedDates[i][1] + generatedDates[i - 1][1]
        }
    }

    return generatedDates
}

export function getConfirmedChartDataCumulative(state: AppState): [number, number][] | undefined {
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

export function getDeathsChartDataCumulative(state: AppState): [number, number][] | undefined {
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

export function getRecoveredChartDataCumulative(state: AppState): [number, number][] | undefined {
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

function generateMissingDates(state: AppState, data: any, cumulative: boolean = false): [number, number][] {
    const cases = data
    const casesCount = data.length
    const casesByDay: [number, number][] = []

    const generatedDates: [number, number][] = []
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
            const currentMilliseconds = casesByDay[i][0]

            if (currentMilliseconds === milliseconds) {
                casesByDay[i][1] = casesByDay[i][1] + 1
                dateAlreadyProcessed = true
                break
            }
        }

        // If not store it
        if (!dateAlreadyProcessed) {
            casesByDay.push([milliseconds, 1])
        }
    }

    // Generate missing dates
    const today = moment(todaysDate).format('YYYY-MM-DD')
    const oldest = moment(oldestDate).format('YYYY-MM-DD')

    for (let m = moment(oldest); m.isSameOrBefore(today); m.add(1, 'days')) {
        const currentMilliseconds = new Date(m.format('YYYY-MM-DD')).getTime()
        generatedDates.push([currentMilliseconds, 0])
    }

    // Assign the data to the generated dates
    for (let i = 0; i < generatedDates.length; i++) {
        let caseFoundOnDate = false

        for (let j = 0; j < casesByDay.length; j++) {
            const currentCaseDate = casesByDay[j][0]
            if (currentCaseDate === generatedDates[i][0]) {
                caseFoundOnDate = true

                if (cumulative) {
                    if (i > 0) {
                        generatedDates[i][1] = generatedDates[i][1] + generatedDates[i - 1][1] + casesByDay[j][1]
                    } else {
                        generatedDates[i][1] = generatedDates[i][1] + casesByDay[j][1]
                    }
                } else {
                    generatedDates[i][1] = generatedDates[i][1] + casesByDay[j][1]
                }
            }
        }

        if (cumulative) {
            if (i > 0 && !caseFoundOnDate) {
                generatedDates[i][1] = generatedDates[i][1] + generatedDates[i - 1][1]
            }
        }
    }

    return generatedDates
}