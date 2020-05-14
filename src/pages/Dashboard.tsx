import React, { Component } from 'react'
import { Container, Grid, Box, withStyles, Theme, StyleRules, createStyles, WithStyles, CircularProgress } from '@material-ui/core'
import KPICard from '../components/KPICard'
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import amber from '@material-ui/core/colors/amber';
import pink from '@material-ui/core/colors/pink';
import CasesByDayChart from '../components/CasesByDayChart';
import CasesByDayChartCumulativeChart from '../components/CasesByDayChartCumulative';
import { connect } from 'react-redux';
import { fetchFinnishCoronaData, fetchHcdTestData, fetchThlTestData } from '../store/actions/actions';
import { bindActionCreators } from 'redux';
import { getHcdTestData, getTotalInfected, getTotalPopulation, getTotalTested, getPercentageOfPopulationTested, getTotalRecovered, getTotalDeaths, getChangeToday, getTestsPerDayChartData, getTestsPerDayChartDataCumulative } from '../store/selectors/selector';
import { AppState } from '../store/configureStore';
import TestedChart from '../components/TestedChart';
import CasesByHealthCareDistrictChart from '../components/CasesByHealthCareDistrictChart';
import TestedPerHealthCareDistrictChart from '../components/TestedPerHealthCareDistrictChart';
import Footer from '../components/Footer';

const styles: (theme: Theme) => StyleRules<string> = () =>
  createStyles({
    loader: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '50vh'
    },
    container: {
      marginTop: 20
    },
  })

interface IProps { }
interface IState { }

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithStyles<typeof styles> &
  IProps


class Dashboard extends Component<Props, IState> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.shouldComponentRender = this.shouldComponentRender.bind(this);
  }

  componentDidMount() {
    this.props.fetchHcdTestData()
    this.props.fetchFinnishCoronaData()
    this.props.fetchThlTestData()
  }

  shouldComponentRender() {
    const { hcdTestDataPending, finnishCoronaDataPending, hcdTestData, finnishCoronaData } = this.props
    if (hcdTestDataPending === true || finnishCoronaDataPending === true) return false
    else if (Object.keys(hcdTestData).length === 0 || finnishCoronaData.confirmed.length === 0) return false
    return true;
  }

  render() {
    const { classes } = this.props

    if (!this.shouldComponentRender()) {
      return (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      )
    }

    // fetch the reducer getters after the initial data has loaded
    const {
      totalInfected,
      percentageOfPopulationTested,
      totalTested,
      totalRecovered,
      totalDeaths,
      changeToday,
      testsChartData,
      testsChartDataCumulative,
    } = this.props;

    return (
      <Container className={classes.container} maxWidth="lg">
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
            <KPICard title="% of population tested" data={percentageOfPopulationTested + ' %'} color={amber[300]} />
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

        </Grid>

        <Footer />
      </Container>
    )
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    hcdTestDataPending: state.finland.hcdTestDataPending,
    hcdTestData: getHcdTestData(state.finland),
    finnishCoronaData: state.finland.finnishCoronaData,
    finnishCoronaDataPending: state.finland.finnishCoronaDataPending,
    totalRecovered: getTotalRecovered(state.finland),
    totalDeaths: getTotalDeaths(state.finland),
    error: state.finland.error,
    totalInfected: getTotalInfected(state.finland),
    totalPopulation: getTotalPopulation(state.finland),
    totalTested: getTotalTested(state.finland),
    percentageOfPopulationTested: getPercentageOfPopulationTested(state.finland),
    changeToday: getChangeToday(state.finland),
    testsChartData: getTestsPerDayChartData(state.finland),
    testsChartDataCumulative: getTestsPerDayChartDataCumulative(state.finland),
  }
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      fetchHcdTestData: fetchHcdTestData,
      fetchFinnishCoronaData: fetchFinnishCoronaData,
      fetchThlTestData: fetchThlTestData
    },
    dispatch
  );

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
