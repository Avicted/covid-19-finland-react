import React from 'react'
import {
    Card,
    Typography,
    CardContent,
    makeStyles,
} from '@material-ui/core'
import { useSelector } from 'react-redux'
import { AppState } from '../../../framework/store/rootReducer'
import {
    getConfirmedChartDataCumulative,
    getDeathsChartDataCumulative,
    getRecoveredChartDataCumulative,
} from '../reducers/dashboardReducer'
import { ChartData } from '../../../entities/ChartData'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, TooltipPayload, TooltipProps, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'
import { purple } from '@material-ui/core/colors'

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
    chart: {
        paddingTop: 14,
    },
    lineChart: {
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

interface CasesByDayChartCumulativeChartProps { 
    logarithmic?: boolean;
}

export const CasesByDayChartCumulativeChart: React.FunctionComponent<CasesByDayChartCumulativeChartProps> = ({
    logarithmic,
}) => {
    const classes = useStyles();
    const confirmed: ChartData[] | undefined = useSelector((state: AppState) => getConfirmedChartDataCumulative(state));
    const deaths: ChartData[] | undefined = useSelector((state: AppState) => getDeathsChartDataCumulative(state));
    const recovered: ChartData[] | undefined = useSelector((state: AppState) => getRecoveredChartDataCumulative(state));

    const chartData = (confirmed: ChartData[], deaths: ChartData[], recovered: ChartData[]): any => {
        const result: any = [];

        for (let i = 0; i < confirmed.length; i++) {
            const recoveredValue: number | undefined = recovered.find((d: ChartData) => d.unixMilliseconds === confirmed[i].unixMilliseconds)?.value;
            const deathsValue: number | undefined = deaths.find((d: ChartData) => d.unixMilliseconds === confirmed[i].unixMilliseconds)?.value;

            const dataPoint: any = {
                unixMilliseconds: confirmed[i].unixMilliseconds,
                confirmed: confirmed[i].value,
                recovered: recoveredValue === undefined ? 0 : recoveredValue,
                deaths: deathsValue === undefined ? 0 : deathsValue,
            }

            result.push(dataPoint);
        }

        return result;
    }

    const renderTooltip = ({ active, payload, label }: TooltipProps): JSX.Element | null => {
        if (active && payload !== undefined) {
            const unixMilliseconds: number = payload[0].payload.unixMilliseconds;
            return (
                <div className={classes.customTooltip}>
                    <p className={classes.tooltipHeader}>{`${format(new Date(unixMilliseconds), 'dd MMM yyyy')}`}</p>
                    {payload.map((p: TooltipPayload, index: number) => (
                        <p className={classes.tooltipValue} style={{ color: p.color }} key={index}>
                            {p.name}: <b>{`${p.value}`}</b>
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
                        Cases by day (cumulative)
                        </Typography>
                    <div className={classes.chart}>
                        {(confirmed !== undefined && deaths !== undefined && recovered !== undefined) && (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={chartData(confirmed, deaths, recovered)}
                                    margin={{
                                        top: 0, right: 0, left: 0, bottom: 0,
                                    }}
                                    className={classes.lineChart}
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
                                        domain={logarithmic === true ? [1, 'dataMax'] : [0, 'auto']} 
                                        allowDataOverflow
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
                                            return value.charAt(0).toUpperCase() + value.slice(1);
                                        }}
                                    />

                                    <Line
                                        dataKey="confirmed"
                                        stroke={purple[200]}
                                        strokeWidth={2}
                                        name="Confirmed"
                                        dot={false}
                                    />
                                    <Line
                                        dataKey="recovered"
                                        stroke={'rgba(129, 199, 132, 1)'}
                                        strokeWidth={2}
                                        name="Recovered"
                                        dot={false}
                                    />
                                    <Line
                                        dataKey="deaths"
                                        stroke={'rgba(229, 115, 115, 1)'}
                                        strokeWidth={2}
                                        name="Deaths"
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
