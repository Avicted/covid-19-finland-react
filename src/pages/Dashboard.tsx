import React, { Component } from 'react'
import { Container, Grid, Box, makeStyles, withStyles, withWidth, Theme, StyleRules, createStyles, WithStyles } from '@material-ui/core'
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
import PropTypes from 'prop-types'
import fetchData from '../store/actions/actions';

const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
    container: {
      marginTop: 20
    },
})

interface IMyProps { 
  
}

interface IMyState { 

}

type Props = IMyProps & WithStyles<typeof styles>

// class Dashboard extends Component<MyProps, MyState> {
class Dashboard extends Component<Props, IMyState> {
  componentDidMount() {
    fetchData()
  }
  
  render() {
    const { classes } = this.props;

    return (
      <Container className={classes.container} maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box fontWeight="fontWeightLight" fontSize="h4.fontSize">
              Finland COVID-19 data
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={2}>
            <KPICard title="Confirmed cases" data="4395" color={purple[200]} />
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

/* Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
} */

function mapStateToProps(state: any) {
  const { pending, data, error } = state

  return {
    pending,
    data,
    error
  }
}

const mapDispatchToProps = (dispatch: any)  => {
  return {
    fetchData: () => dispatch(fetchData()),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard))
