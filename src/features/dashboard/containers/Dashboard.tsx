import React, { Component } from 'react'
import { KPICard } from '../components/KPICard'
import { CasesByDayChart } from '../components/CasesByDayChart'
import { CasesByDayChartCumulativeChart } from '../components/CasesByDayChartCumulative'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { TestedChart } from '../components/TestedChart'
import { CasesByHealthCareDistrictChart } from '../components/CasesByHealthCareDistrictChart'
import { TestedPerHealthCareDistrictChart } from '../components/TestedPerHealthCareDistrictChart'
import { AppState } from '../../../framework/store/rootReducer'
import {
    getConfirmedPastSevenDays,
    getPercentageOfPopulationTested,
    getTestsPerDayChartData,
    getTestsPerDayChartDataCumulative,
    getTotalDeaths,
    getTotalInfected,
    getTotalPopulation,
    getTotalRecovered,
    getTotalTested,
} from '../reducers/dashboardReducer'
import { ChartData } from '../../../entities/ChartData'
import { FinlandMap } from '../components/FinlandMap'
import { Footer } from '../../../framework/components/Footer'


interface DashboardProps {
    totalRecovered: number | undefined
    totalDeaths: number | undefined
    infectionsPastSevenDays: number | undefined;
    totalInfected: number | undefined
    totalPopulation: number
    totalTested: number
    percentageOfPopulationTested: number | string
    testsChartData: ChartData[] | undefined
    testsChartDataCumulative: ChartData[] | undefined
}

class Dashboard extends Component<DashboardProps> {
    render() {
        const {
            totalInfected,
            percentageOfPopulationTested,
            totalTested,
            totalRecovered,
            totalDeaths,
            infectionsPastSevenDays,
            testsChartData,
            testsChartDataCumulative,
        } = this.props

        return (
            <div className="container mx-auto mt-4 pl-4 pr-4">
                <div className="grid gap-4">
                    <div className="grid-cols-12">
                        <div className="font-sans text-2xl text-white">Finland COVID-19 data</div>
                    </div>
                    <div className="grid grid-flow-col grid-cols-1 grid-rows-6 sm:grid-rows-3 sm:grid-cols-2 xl:grid-rows-1 xl:grid-cols-6 gap-4">
                        <KPICard title="Confirmed cases" data={totalInfected} color={'text-purple-300'} />
                        <KPICard title="Recovered cases" data={totalRecovered} color={'text-green-300'} />
                        <KPICard title="Deaths" data={totalDeaths} color={'text-red-300'} />
                        <KPICard title="Infections past 7 days" data={infectionsPastSevenDays} color={'text-gray-300'} />
                        <KPICard
                            title="% of population tested"
                            data={percentageOfPopulationTested + ' %'}
                            color={'text-yellow-300'}
                        />
                        <KPICard title="Tested cases" data={totalTested} color={'text-pink-400'} />
                    </div>

                    <div className="grid grid-flow-col grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 gap-4">
                        <CasesByDayChart />
                        <CasesByDayChartCumulativeChart logarithmic={true} />
                    </div>

                    <div className="grid grid-flow-col grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 gap-4">
                        <TestedChart title="Tests by day" tests={testsChartData} />
                        <TestedChart title="Tests by day (cumulative)" tests={testsChartDataCumulative} />
                    </div>

                    <div className="grid grid-flow-col grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 gap-4">
                        <CasesByHealthCareDistrictChart />
                        <TestedPerHealthCareDistrictChart />
                    </div>

                    <div className="grid grid-flow-col grid-cols-1 grid-rows-1 gap-4">
                        <FinlandMap />
                    </div>

                    <div className="grid grid-flow-col grid-cols-1 grid-rows-1 gap-4">
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        totalRecovered: getTotalRecovered(state),
        totalDeaths: getTotalDeaths(state),
        infectionsPastSevenDays: getConfirmedPastSevenDays(state),
        totalInfected: getTotalInfected(state),
        totalPopulation: getTotalPopulation(state),
        totalTested: getTotalTested(state),
        percentageOfPopulationTested: getPercentageOfPopulationTested(state),
        testsChartData: getTestsPerDayChartData(state),
        testsChartDataCumulative: getTestsPerDayChartDataCumulative(state),
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
