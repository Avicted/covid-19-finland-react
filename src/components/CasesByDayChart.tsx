import React from 'react'
import { Card, makeStyles, Typography, CardContent } from '@material-ui/core'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
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

function CasesByDayChart(props: { confirmed: any, deaths: any }) {
  const classes = useStyles();
  const { confirmed, deaths } = props
  const series = [
    {
      name: 'New infections',
      data: confirmed
    },
    {
      name: 'Deaths',
      data: deaths
    }
  ]
  /* const data = [
    { value: 14, time: 1503617297689 },
    { value: 25, time: 1503616962277 },
    { value: 55, time: 1503616882654 },
    { value: 102, time: 1503613184594 },
    { value: 255, time: 1503611308914 },
  ]; */

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            Cases by day
          </Typography>
          <ResponsiveContainer width='95%' height={375} >
            {/* <LineChart height={375} data={series}> */}
            <LineChart height={375}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey='time'
                domain={['auto', 'auto']}
                name='Time'
                tickFormatter={(unixTime) => moment(unixTime).format('HH:mm Do')}
                type='number'
              />
              <YAxis dataKey='value' name='Value' tickCount={5} />
              <Tooltip />
              <Legend />
              {series.map(s => (
                <Line dataKey="value" data={s.data} name={s.name} key={s.name} />
              ))}
              {/* <Line type="monotone" dataKey="value" stroke="#8884d8" /> */}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default CasesByDayChart