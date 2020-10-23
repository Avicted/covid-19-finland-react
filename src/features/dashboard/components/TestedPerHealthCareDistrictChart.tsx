import React from 'react'
import {
    Card,
    Typography,
    CardContent,
    makeStyles,
} from '@material-ui/core'
import { TestsByHealthCareDistrictChartData } from '../../../entities/TestsByHealthCareDistrictChartData';
import { getTestsPerHealthCareDistrictChartData } from '../reducers/dashboardReducer';
import { useSelector } from 'react-redux';
import { AppState } from '../../../framework/store/rootReducer';
import { Bar, BarChart, CartesianGrid, Cell, Legend, LegendPayload, ResponsiveContainer, Tooltip, TooltipPayload, TooltipProps, YAxis } from 'recharts';
import { getColor } from '../../../utils';

const useStyles = makeStyles({
    cardcontent: {
        '&:last-child': {
            paddingBottom: 12,
        },
    },
    card: {
    },
    title: {
        fontSize: 14,
        marginBottom: 0,
        display: 'inline',
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
    tooltipValue: {
        marginTop: 5,
        marginBottom: 5,
    },
})

interface TestedPerHealthCareDistrictChartProps { }

export const TestedPerHealthCareDistrictChart: React.FunctionComponent<TestedPerHealthCareDistrictChartProps> = () => {
    const classes = useStyles();
    const data: TestsByHealthCareDistrictChartData[] | undefined = useSelector((state: AppState) => getTestsPerHealthCareDistrictChartData(state));

    const renderTooltip = ({ active, payload, label }: TooltipProps): JSX.Element | null => {
        if (active && payload !== undefined) {
            return (
                <div className={classes.customTooltip}>
                    {payload.map((p: TooltipPayload, index: number) => (
                        <p className={classes.tooltipValue} key={index}>
                            {p.payload.name}: <b style={{ color: getColor(data?.findIndex(data => data.name === p.payload.name)) }}>{`${p.value}`}</b>
                        </p>
                    ))}
                </div>
            );
        };

        return null;
    }

    return (
        <div>
            <Card className={classes.card}>
                <CardContent className={classes.cardcontent}>
                    <Typography className={classes.title} gutterBottom>
                        Tests by health care district
                        </Typography>
                    <div className={classes.chart}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={data}
                                margin={{
                                    top: 0, right: 0, left: 0, bottom: 10,
                                }}
                                className={classes.barChart}
                            >
                                <CartesianGrid
                                    strokeDasharray="8 8"
                                    vertical={false}
                                />
                                <YAxis
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

                                <Tooltip content={renderTooltip} cursor={{ fill: '#1d2842' }} />

                                <Legend
                                    iconSize={12}
                                    wrapperStyle={{ fontSize: 12, paddingTop: 20 }}
                                    payload={data?.map((dataPoint: TestsByHealthCareDistrictChartData, index: number) => {
                                        const legendPayload: LegendPayload = {
                                            value: dataPoint.name,
                                            type: 'circle',
                                            id: dataPoint.name,
                                            color: getColor(index),
                                        }

                                        return legendPayload;
                                    })}
                                />

                                {data !== undefined && (
                                    <Bar dataKey="data">
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${entry.name}`} fill={getColor(index)} />
                                        ))}
                                    </Bar>
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
