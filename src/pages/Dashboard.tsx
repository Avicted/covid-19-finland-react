import React, { Component, Dispatch } from 'react'
import { Container, Grid, Box, withStyles, Theme, StyleRules, createStyles, WithStyles, CircularProgress } from '@material-ui/core'
import KPICard from '../components/KPICard'
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import amber from '@material-ui/core/colors/amber';
import pink from '@material-ui/core/colors/pink';
import CasesByDayChart from '../components/CasesByDayChart';
import CasesByDayChartCumulative from '../components/CasesByDayChartCumulative';
import { connect, ReactReduxContext } from 'react-redux';
import { fetchFinnishCoronaData, fetchHcdTestData } from '../store/actions/actions';
// import { getHcdTestData, getDataError, getFinnishCoronaData, getHcdTestDataPending, getFinnishCoronaDataPending } from '../store/reducers/reducer';
import { State } from '../store/reducers/reducer';
import { AppActions } from '../models/actions';
import { bindActionCreators, compose } from 'redux';
import { HcdTestData } from '../models/HcdTestData';

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

interface IMyProps { }
interface IMyState { }

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithStyles<typeof styles> &
  IMyProps


class Dashboard extends Component<Props, IMyState> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.shouldComponentRender = this.shouldComponentRender.bind(this);
  }

  componentDidMount() {
    console.log(`Dashboard componentDidMount`)
    this.props.fetchHcdTestData()
    this.props.fetchFinnishCoronaData()
  }

  shouldComponentRender() {
    const { hcdTestDataPending, finnishCoronaDataPending } = this.props;
    if (hcdTestDataPending === true || finnishCoronaDataPending === true) return false;
    return true;
  }

  render() {
    const { classes, hcdTestData, finnishCoronaData, error } = this.props;

    if (!this.shouldComponentRender()) {
      return (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      )
    }

    return (
      <Container className={classes.container} maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box fontWeight="fontWeightLight" fontSize="h4.fontSize">
              Finland COVID-19 data
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={2}>
            <KPICard title="Confirmed cases" data={hcdTestData["Kaikki sairaanhoitopiirit"].infected} color={purple[200]} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={2}>
            <KPICard title="Recovered cases" data="0" color={green[200]} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={2}>
            <KPICard title="Deaths" data="177" color={red[300]} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={2}>
            <KPICard title="Infections change today" data="-16" color={grey[200]} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={2}>
            <KPICard title="% of population tested" data="1.34 %" color={amber[300]} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={2}>
            <KPICard title="Tested cases" data={hcdTestData["Kaikki sairaanhoitopiirit"].tested} color={pink[400]} />
          </Grid>

          <Grid item xs={12} lg={6}>
            <CasesByDayChart />
          </Grid>
          <Grid item xs={12} lg={6}>
            <CasesByDayChartCumulative />
          </Grid>

        </Grid>
      </Container>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    hcdTestDataPending: state.data.hcdTestDataPending,
    hcdTestData: state.data.hcdTestData,
    finnishCoronaData: state.data.finnishCoronaData,
    finnishCoronaDataPending: state.data.finnishCoronaDataPending,
    error: state.data.error
  }
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      fetchHcdTestData: fetchHcdTestData,
      fetchFinnishCoronaData: fetchFinnishCoronaData
    },
    dispatch
  );


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Dashboard));