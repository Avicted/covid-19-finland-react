import React from 'react'
import { Card, makeStyles, Typography, CardContent } from '@material-ui/core'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import moment from 'moment';

const useStyles = makeStyles({
  card: {
    minHeight: 400,
  },
  title: {
    fontSize: 14,
    marginBottom: 0
  }
});

function CasesByDayChart() {
  const classes = useStyles();
  const data = [
    { value: 14, time: 1503617297689 },
    { value: 25, time: 1503616962277 },
    { value: 55, time: 1503616882654 },
    { value: 102, time: 1503613184594 },
    { value: 255, time: 1503611308914 },
  ];

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            Cases by day
          </Typography>
          <ResponsiveContainer width='95%' height={375} >
            <LineChart height={375} data={data}>
              <XAxis
                dataKey='time'
                domain={['auto', 'auto']}
                name='Time'
                tickFormatter={(unixTime) => moment(unixTime).format('HH:mm Do')}
                type='number'
              />
              <YAxis dataKey='value' name='Value' />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default CasesByDayChart