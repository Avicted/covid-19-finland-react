import React from 'react';
import { Card, CardContent, Typography, makeStyles, Box } from '@material-ui/core'

const useStyles = makeStyles({
  cardcontent: {
    "&:last-child": {
      paddingBottom: 12
    }
  },
  title: {
    fontSize: 12,
    marginBottom: 0
  },
  data: {
    fontSize: 32,
    textAlign: 'center'
  }
});

function KPICard(props: {title: String, data: String, color: String}) {
  const classes = useStyles();
  const { title, data, color } = props;

  return (
    <Card>
      <CardContent className={classes.cardcontent}>
        <Typography className={classes.title} gutterBottom>
          { title }
        </Typography>
        <Box color={color}>
          <Typography className={classes.data} variant="h5" component="h2">
            { data }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default KPICard