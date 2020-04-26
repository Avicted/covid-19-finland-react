import React, { Component } from 'react'
import { Container, Grid, Box, withStyles, Theme, StyleRules, createStyles, WithStyles } from '@material-ui/core'
import KPICard from '../components/KPICard'
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import amber from '@material-ui/core/colors/amber';
import pink from '@material-ui/core/colors/pink';
import CasesByDayChart from '../components/CasesByDayChart';
import CasesByDayChartCumulative from '../components/CasesByDayChartCumulative';
import { connect } from 'react-redux';
import { fetchFinnishCoronaData, fetchHcdTestData } from '../store/actions/actions';
import { getHcdTestData, getDataError, getFinnishCoronaData, getHcdTestDataPending, getFinnishCoronaDataPending } from '../store/reducers/reducer';

const styles: (theme: Theme) => StyleRules<string> = () =>
  createStyles({
    container: {
      marginTop: 20
    },
})

interface IMyProps { }
interface IMyState { }

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>& 
  IMyProps &
  WithStyles<typeof styles>


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
    if (hcdTestDataPending === true && finnishCoronaDataPending === true) return false;
    return true;
  }

  render() {
    const { classes, error, hcdTestDataPending } = this.props;

    if (!this.shouldComponentRender()) {
      return (<div>Loading...</div>)
    }

    return (
      <Container className={classes.container} maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box fontWeight="fontWeightLight" fontSize="h4.fontSize">
              Finland COVID-19 data
              <br></br>
              <span>error: { error }</span>
              <br></br>
              <span>hcdTestDataPending: { hcdTestDataPending }</span>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={2}>
            <KPICard title="Confirmed cases" data={this.props.hcdTestData} color={purple[200]} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={2}>
            <KPICard title="Recovered cases" data="10" color={green[200]} />
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
            <KPICard title="Tested cases" data="74557" color={pink[400]} />
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

const mapStateToProps = (state: any) => ({
  hcdTestDataPending: getHcdTestDataPending(state),
  hcdTestData: getHcdTestData(state),
  finnishCoronaData: getFinnishCoronaData(state),
  finnishCoronaDataPending: getFinnishCoronaDataPending(state),
  error: getDataError(state),
})

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchHcdTestData: () => dispatch(fetchHcdTestData()),
    fetchFinnishCoronaData: () => dispatch(fetchFinnishCoronaData()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard))