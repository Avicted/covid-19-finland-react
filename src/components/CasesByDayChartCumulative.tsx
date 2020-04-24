import React from 'react'
import { Card, makeStyles, Typography, CardContent } from '@material-ui/core'

const useStyles = makeStyles({
  card: {
    minHeight: 400,
  },
  title: {
    fontSize: 14,
    marginBottom: 0
  }
});

function CasesByDayChartCumulative() {
  const classes = useStyles();

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            Cases by day (cumulative)
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default CasesByDayChartCumulative