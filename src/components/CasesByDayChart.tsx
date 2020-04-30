import React from 'react'
import { Card, makeStyles, Typography, CardContent } from '@material-ui/core'
import Chart from 'react-apexcharts';

const useStyles = makeStyles({
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
});

function CasesByDayChart(props: { confirmed: any, recovered: any, deaths: any,  }) {
  const classes = useStyles();
  const { confirmed, recovered, deaths } = props

  const series = [
    {
      name: 'New infections',
      data: confirmed
    },
    {
      name: 'Recovered',
      data: recovered
    },
    {
      name: 'Deaths',
      data: deaths
    },
  ]

  const options = {
    theme: {
      mode: "dark"
    },
    colors: ["#ce93d8", "#81c784", "#e57373", "#ffd54f"],
    chart: {
      id: "cases-by-day",
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
    }
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent className={classes.cardcontent}>
          <Typography className={classes.title} gutterBottom>
            Cases by day
          </Typography>
          <div className={classes.chart}>
            <Chart options={options} series={series} type="area" width='100%' height={300} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CasesByDayChart