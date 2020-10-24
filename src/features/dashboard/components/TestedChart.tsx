import React from 'react'
import {
    Card,
    Typography,
    CardContent,
    makeStyles,
} from '@material-ui/core'
import { ChartData } from '../../../entities/ChartData'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

const useStyles = makeStyles({
    cardcontent: {
        '&:last-child': {
            paddingBottom: 12,
        },
    },
    card: {
        minHeight: 300,
    },
    title: {
        fontSize: 14,
        marginBottom: 0,
        display: 'inline',
    },
    chartTypeMenuButton: {
        float: 'right',
    },
    chart: {
        paddingTop: 14,
    },
    barChart: {
        fontFamily: 'Roboto',
        '& .recharts-cartesian-axis-tick': {
            fontFamily: 'Roboto',
            fontSize: '0.8rem',
            '& tspan': {
                fill: 'white',
            },
        },
        '& .recharts-cartesian-grid-horizontal': {
            '& line': {
                stroke: '#495e8e',
            },
        },
        '& .recharts-tooltip-wrapper': {
            borderRadius: 5,
            backgroundColor: '#0c111f',
            minWidth: 100,
        },
    },
    customTooltip: {
        background: '#0c111f',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 12,
        fontFamily: 'Roboto',
    },
    tooltipHeader: {
        marginTop: 10,
        marginBottom: 10,
    },
    tooltipValue: {
        marginTop: 5,
        marginBottom: 5,
    },
})

interface TestedChartProps {
    title: string;
    tests: ChartData[] | undefined;
    logarithmic?: boolean;
}

export const TestedChart: React.FunctionComponent<TestedChartProps> = ({
    title,
    tests,
    logarithmic,
}) => {
    const classes: Record<string, string> = useStyles();

    const renderTooltip = ({ active, payload, label }: any): JSX.Element | null => {
        if (active) {
            const unixMilliseconds: number = payload[0].payload.unixMilliseconds;
            const value: number = payload[0].payload.value;
            const color: string = payload[0].color;

            return (
                <div className={classes.customTooltip}>
                    <p className={classes.tooltipHeader}>{`${format(new Date(unixMilliseconds), 'dd MMM yyyy')}`}</p>
                    <p className={classes.tooltipValue} style={{ color: color }}>
                        Tested: <b>{`${value}`}</b>
                    </p>
                </div>
            );
        }

        return null;
    }

    return (
        <div>
            <Card className={classes.card}>
                <CardContent className={classes.cardcontent}>
                    <Typography className={classes.title} gutterBottom>
                        {title}
                    </Typography>
                    <div className={classes.chart}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={tests}
                                margin={{
                                    top: 0, right: 0, left: 0, bottom: 0,
                                }}
                                barGap={0}
                                barCategoryGap={0}
                                maxBarSize={100}
                                barSize={100}
                                className={classes.barChart}
                            >
                                <CartesianGrid
                                    strokeDasharray="8 8"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="unixMilliseconds"
                                    tickFormatter={unixMilliseconds => format(new Date(unixMilliseconds), 'MMM yy')}
                                    name="Date"
                                    minTickGap={40}
                                />
                                <YAxis
                                    scale={logarithmic === true ? 'log' : 'auto'}
                                    domain={logarithmic === true ? [0.01, 'dataMax'] : [0, 'auto']} 
                                    allowDataOverflow
                                    dataKey="value"
                                    tickFormatter={(value: number) => {
                                        if (value >= 1000000) {
                                            const result = (value / 1000000).toFixed(1)
                                            return `${result}M`
                                        }
                                        else if (value >= 1000) {
                                            const result = (value / 1000).toFixed(0)
                                            return `${result}k`
                                        } else {
                                            return value
                                        }
                                    }}
                                />
                                <Tooltip content={renderTooltip} cursor={{fill: '#1d2842'}} />
                                <Legend
                                    wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                                    formatter={(value, entry, index) => {
                                        return 'Tested'
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill={'rgba(255, 213, 79, 1)'}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
