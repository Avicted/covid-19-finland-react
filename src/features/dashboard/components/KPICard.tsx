import React from 'react'
import { Card, CardContent, Typography, makeStyles, Box } from '@material-ui/core'

const useStyles = makeStyles({
    cardcontent: {
        '&:last-child': {
            paddingBottom: 12,
        },
    },
    title: {
        fontSize: 14,
        marginBottom: 0,
    },
    data: {
        fontSize: 42,
        textAlign: 'center',
    },
})

interface KPICardProps {
    title: string;
    data: number | string | undefined;
    color: string;
}

export const KPICard: React.FunctionComponent<KPICardProps> = ({
    title, 
    data, 
    color, 
}) => {
    const classes = useStyles()

    return (
        <Card>
            <CardContent className={classes.cardcontent}>
                <Typography className={classes.title} gutterBottom>
                    {title}
                </Typography>
                <Box color={color}>
                    <Typography className={classes.data} variant="h5" component="h2">
                        {data}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
