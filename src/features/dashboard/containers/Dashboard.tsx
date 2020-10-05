import React, { Component } from 'react'
import { Container, Grid, Box, withStyles, Theme, createStyles } from '@material-ui/core'
import { KPICard } from '../components/KPICard'
import purple from '@material-ui/core/colors/purple'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import grey from '@material-ui/core/colors/grey'
import amber from '@material-ui/core/colors/amber'
import pink from '@material-ui/core/colors/pink'
import CasesByDayChart from '../components/CasesByDayChart'
import CasesByDayChartCumulativeChart from '../components/CasesByDayChartCumulative'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import TestedChart from '../components/TestedChart'
import CasesByHealthCareDistrictChart from '../components/CasesByHealthCareDistrictChart'
import TestedPerHealthCareDistrictChart from '../components/TestedPerHealthCareDistrictChart'
import { AppState } from '../../../framework/store/rootReducer'
import {
    getChangeToday,
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

const styles = (theme: Theme) =>
    createStyles({
        container: {
            marginTop: 20,
        },
    })

interface DashboardProps {
    classes: Record<string, string>

    totalRecovered: number | undefined
    totalDeaths: number | undefined
    totalInfected: number | undefined
    totalPopulation: number
    totalTested: number
    percentageOfPopulationTested: number | string
    changeToday: string
    testsChartData: ChartData[] | undefined
    testsChartDataCumulative: ChartData[] | undefined
}

class Dashboard extends Component<DashboardProps> {
    render() {
        const { classes } = this.props
        const {
            totalInfected,
            percentageOfPopulationTested,
            totalTested,
            totalRecovered,
            totalDeaths,
            changeToday,
            testsChartData,
            testsChartDataCumulative,
        } = this.props

        return (
            <Container className={classes.container} maxWidth="xl">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box fontWeight="fontWeightLight" fontSize="h5.fontSize">
                            Finland COVID-19 data
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={2}>
                        <KPICard title="Confirmed cases" data={totalInfected} color={purple[200]} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={2}>
                        <KPICard title="Recovered cases" data={totalRecovered} color={green[200]} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={2}>
                        <KPICard title="Deaths" data={totalDeaths} color={red[300]} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={2}>
                        <KPICard title="Infections change today" data={changeToday} color={grey[200]} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={2}>
                        <KPICard
                            title="% of population tested"
                            data={percentageOfPopulationTested + ' %'}
                            color={amber[300]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={2}>
                        <KPICard title="Tested cases" data={totalTested} color={pink[400]} />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <CasesByDayChart />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <CasesByDayChartCumulativeChart />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <TestedChart title="Tests by day" tests={testsChartData} />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <TestedChart title="Tests by day (cumulative)" tests={testsChartDataCumulative} />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <CasesByHealthCareDistrictChart />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <TestedPerHealthCareDistrictChart />
                    </Grid>
                    <Grid item xs={12}>
                        <FinlandMap />
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        totalRecovered: getTotalRecovered(state),
        totalDeaths: getTotalDeaths(state),
        totalInfected: getTotalInfected(state),
        totalPopulation: getTotalPopulation(state),
        totalTested: getTotalTested(state),
        percentageOfPopulationTested: getPercentageOfPopulationTested(state),
        changeToday: getChangeToday(state),
        testsChartData: getTestsPerDayChartData(state),
        testsChartDataCumulative: getTestsPerDayChartDataCumulative(state),
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard))
