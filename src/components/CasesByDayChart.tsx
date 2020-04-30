import React, { Component } from 'react'
import { Card, Typography, CardContent, Button, Menu, MenuItem, WithStyles, Theme, StyleRules, createStyles, withStyles } from '@material-ui/core'
import Chart from 'react-apexcharts';

const styles: (theme: Theme) => StyleRules<string> = () =>
  createStyles({
    cardcontent: {
      "&:last-child": {
        paddingBottom: 12
      }
    },
    card: {
      minHeight: 300,
    },
    title: {
      fontSize: 14,
      marginBottom: 0
    },
    chart: {

    }
  })

interface IProps {
  confirmed: any,
  recovered: any,
  deaths: any
}

interface IState {
  options: any,
  series: any,
  anchorEl: HTMLElement | null
}

type Props = WithStyles<typeof styles> & IProps

class CasesByDayChart extends Component<Props, IState> {
  state = {
    anchorEl: null,
    options: {
      theme: {
        mode: "dark"
      },
      colors: ["#ce93d8", "#81c784", "#e57373", "#ffd54f"],
      chart: {
        id: "cases-by-day",
        type: "area",
        // group: "covid-cases",
        fontFamily: "Roboto",
        stacked: false,
        animations: {
          enabled: false
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      xaxis: {
        type: "datetime",
        crosshairs: {
          show: true,
          width: 1,
          position: "back",
          opacity: 0.9,
          stroke: {
            color: "#b6b6b6",
            width: 1,
            dashArray: 3
          }
        }
      },
      yaxis: {
        labels: {
          minWidth: 40
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "90%"
        }
      },
      stroke: {
        show: true,
        curve: "straight",
        colors: undefined,
        width: [2, 2, 2, 2],
        dashArray: [0, 0, 0, 0]
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        shared: true,
        followCursor: true
      },
      legend: {
        show: true,
        position: "bottom"
      },
      grid: {
        borderColor: "#525252",
        strokeDashArray: 7
      },
    },
    series: [
      {
        name: 'New infections',
        data: this.props.confirmed
      },
      {
        name: 'Recovered',
        data: this.props.recovered
      },
      {
        name: 'Deaths',
        data: this.props.deaths
      }
    ]
  }

  handleChartTypeSelection = (chartType: any) => {
    this.setState(state => {
      state.options.chart.type = chartType
    })
  }

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState((state: any) => ({
      anchorEl: event.currentTarget
    }));
  }
  
  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Card className={classes.card}>
          <CardContent className={classes.cardcontent}>
            <Typography className={classes.title} gutterBottom>
              Cases by day
              </Typography>
            <Button aria-controls="simple-menu" aria-haspopup="true" size="small" color="primary" onClick={this.handleClick}>
              Open Menu
              </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={() => this.handleChartTypeSelection('area')}>Area</MenuItem>
              <MenuItem onClick={() => this.handleChartTypeSelection('line')}>Line</MenuItem>
              <MenuItem onClick={() => this.handleChartTypeSelection('bar')}>Bar</MenuItem>
            </Menu>
            <div className={classes.chart}>
              <Chart options={this.state.options} series={this.state.series} width='100%' height={300} />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default withStyles(styles)(CasesByDayChart)