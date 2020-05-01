import React, { Component } from 'react'
import { Card, Typography, CardContent, WithStyles, Theme, StyleRules, createStyles, withStyles } from '@material-ui/core'
import ReactApexChart from 'react-apexcharts';

const styles: (theme: Theme) => StyleRules<string> = () =>
  createStyles({
    cardcontent: {
      "&:last-child": {
        paddingBottom: 12
      }
    },
    card: {
      minHeight: 400,
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
  series: any,
  labels: any
}

interface IState {
  options: any,
  series: any,
  anchorEl: any
}

type Props = WithStyles<typeof styles> & IProps

class CasesByHealthCareDistrict extends Component<Props, IState> {
  state = {
    anchorEl: null,
    options: {
      theme: {
        mode: "dark"
      },
      colors: [
        "#e57373",
        "#f06292",
        "#ba68c8",
        "#9575cd",
        "#7986cb",
        "#64b5f6",
        "#4fc3f7",
        "#4dd0e1",
        "#4db6ac",
        "#81c784",
        "#aed581",
        "#dce775",
        "#fff176",
        "#ffd54f",
        "#ffb74d",
        "#ff8a65",
        "#a1887f"
      ],
      chart: {
        stacked: false,
        type: "bar",
        animations: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: true,
        textAnchor: "middle",
        offsetY: -20,
        style: {
          fontSize: '10px'
        },
      },
      legend: {
        show: true,
        position: "right"
      },
      grid: {
        borderColor: "#525252",
        strokeDashArray: 7
      },
      xaxis: {
        type: "category",
        categories: this.props.labels,
        labels: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          columnWidth: "100%",
          dataLabels: {
            position: "top"
          }
        }
      },
      responsive: [
        {
          breakpoint: 1400,
          options: {
            legend: {
              show: true,
              position: "bottom",
              itemMargin: {
                horizontal: 3,
                vertical: 3
              }
            },
          }
        }
      ],
      tooltip: {
        fillSeriesColor: false,
        x: {
          show: false
        }
      }
    },
    series: this.props.series
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Card className={classes.card}>
          <CardContent className={classes.cardcontent}>
            <Typography className={classes.title} gutterBottom>
              Infections by health care district
            </Typography>
            <div className={classes.chart}>
              <ReactApexChart options={this.state.options} series={this.state.series} type={this.state.options.chart.type as any} width='100%' height={400} />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default withStyles(styles)(CasesByHealthCareDistrict)