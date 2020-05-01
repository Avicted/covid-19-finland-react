import React, { Component } from 'react'
import { Card, Typography, CardContent, Button, Menu, MenuItem, WithStyles, Theme, StyleRules, createStyles, withStyles } from '@material-ui/core'
import ReactApexChart from 'react-apexcharts';

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
      marginBottom: 0,
      display: 'inline'
    },
    chartTypeMenuButton: {
      float: 'right'
    },
    chart: {
      paddingTop: 14
    }
  })

interface IProps {
  title: string,
  tests: any,
}

interface IState {
  options: any,
  series: any,
  anchorEl: any
}

type Props = WithStyles<typeof styles> & IProps

class TestedChart extends Component<Props, IState> {
  state = {
    anchorEl: null,
    options: {
      theme: {
        mode: "dark"
      },
      colors: [
        'rgba(255, 213, 79, 1)',
      ],
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
          minWidth: 40,
          formatter: function(value: number) {
            if (value > 999) {
              const result = (value / 1000).toFixed(1);
              return `${result}k`;
            } else {
              return value;
            }
          }
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
        width: [2, 2, 2],
        dashArray: [0, 0, 0]
      },
      fill: {
        colors: undefined,
        opacity: 0.1,
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: "vertical",
          shadeIntensity: 0.5,
          inverseColors: true,
          opacityFrom: 0,
          opacityTo: 0.1,
        },
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
        name: 'Tests',
        data: this.props.tests
      },
    ]
  }

  handleChartTypeSelection(chartType: any) {
    let fill: any = this.state.options.fill;

    if (chartType === 'line') {
      fill = {
        ...this.state.options.fill,
        type: 'solid',
      }
    } else {
      fill = {
        ...this.state.options.fill,
        type: 'gradient',
      }
    }

    this.setState({
      anchorEl: null,
      options: {
        ...this.state.options,
        chart: {
          ...this.state.options.chart,
          type: chartType
        },
        fill: fill
      }
    })
  }

  handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  handleClose(event: any) {
    this.setState({
      anchorEl: null
    });
  }

  render() {
    const { classes, title } = this.props
    const { type } = this.state.options.chart

    return (
      <div>
        <Card className={classes.card}>
          <CardContent className={classes.cardcontent}>
            <Typography className={classes.title} gutterBottom>
                { title }
            </Typography>
            <Button className={classes.chartTypeMenuButton} aria-controls="simple-menu" aria-haspopup="true" size="small" color="primary" onClick={(e) => this.handleClick(e)}>
              Chart style
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={(e) => this.handleClose(e)}
            >
              <MenuItem selected={type === 'area' ? true : false} dense onClick={() => this.handleChartTypeSelection('area')}>Area</MenuItem>
              <MenuItem selected={type === 'line' ? true : false} dense onClick={() => this.handleChartTypeSelection('line')}>Line</MenuItem>
              <MenuItem selected={type === 'bar' ? true : false} dense onClick={() => this.handleChartTypeSelection('bar')}>Bar</MenuItem>
            </Menu>
            <div className={classes.chart}>
              <ReactApexChart options={this.state.options} series={this.state.series} type={this.state.options.chart.type as any} width='100%' height={300} />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default withStyles(styles)(TestedChart)