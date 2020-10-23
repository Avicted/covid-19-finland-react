import React from 'react'
import {
    Card,
    Typography,
    CardContent,
    makeStyles,
} from '@material-ui/core'
import { useSelector } from 'react-redux'
import { getConfirmedChartData, getConfirmedChartDataSevenDaysRollingAverage, getConfirmedStillBeingUpdated } from '../reducers/dashboardReducer'
import { AppState } from '../../../framework/store/rootReducer'
import theme from '../../../theme/theme'
import { ChartData } from '../../../entities/ChartData'
import { grey, purple } from '@material-ui/core/colors'
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, TooltipPayload, TooltipProps, XAxis, YAxis } from 'recharts'
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
    composedChart: {
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

interface CasesByDayChartProps { }

export const CasesByDayChart: React.FunctionComponent<CasesByDayChartProps> = () => {
    const classes = useStyles();
    const confirmedChartDataSevenDaysRollingAverage: ChartData[] | undefined = useSelector((state: AppState) => getConfirmedChartDataSevenDaysRollingAverage(state));
    const confirmed: ChartData[] | undefined = useSelector((state: AppState) => getConfirmedChartData(state));
    const confirmedStillBeingUpdated: ChartData[] | undefined = useSelector((state: AppState) => getConfirmedStillBeingUpdated(state));

    const chartData = (confirmedChartDataSevenDaysRollingAverage: ChartData[], confirmed: ChartData[], confirmedStillBeingUpdated: ChartData[]): any => {
        const result: any = [];

        for (let i = 0; i < confirmed.length; i++) {
            const confirmedChartDataSevenDaysRollingAverageValue: number | undefined = confirmedChartDataSevenDaysRollingAverage.find((d: ChartData) => d.unixMilliseconds === confirmed[i].unixMilliseconds)?.value;
            const confirmedStillBeingUpdatedValue: number | undefined = confirmedStillBeingUpdated.find((d: ChartData) => d.unixMilliseconds === confirmed[i].unixMilliseconds)?.value;

            const dataPoint: any = {
                unixMilliseconds: confirmed[i].unixMilliseconds,
                confirmed: confirmed[i].value,
                confirmedChartDataSevenDaysRollingAverage: confirmedChartDataSevenDaysRollingAverageValue === undefined ? 0 : confirmedChartDataSevenDaysRollingAverageValue,
                confirmedStillBeingUpdated: confirmedStillBeingUpdatedValue === undefined ? 0 : confirmedStillBeingUpdatedValue,
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
                        Cases by day
                        </Typography>
                    <div className={classes.chart}>
                        {(confirmedChartDataSevenDaysRollingAverage !== undefined && confirmed !== undefined && confirmedStillBeingUpdated !== undefined) && (
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart
                                    data={chartData(confirmedChartDataSevenDaysRollingAverage, confirmed, confirmedStillBeingUpdated)}
                                    margin={{
                                        top: 0, right: 0, left: 0, bottom: 0,
                                    }}
                                    className={classes.composedChart}
                                    // barCategoryGap='0%'
                                    // barGap='0%'
                                    barSize={200}
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

                                    <Bar
                                        dataKey="confirmed"
                                        name="Confirmed"
                                        fill={theme.palette.secondary.dark}
                                    />
                                    <Bar
                                        dataKey="confirmedStillBeingUpdated"
                                        name="Confirmed cases still being updated"
                                        fill={grey[500]}
                                    />
                                    <Line
                                        dataKey="confirmedChartDataSevenDaysRollingAverage"
                                        name="Confirmed cases 7 days rolling average"
                                        stroke={purple[200]}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


/*
state = {
        anchorEl: null,
        options: {
            theme: {
                mode: 'dark',
            },
            colors: [
                purple[200],
                theme.palette.secondary.dark,
                grey[500],
            ],
            chart: {
                id: 'cases-by-day',
                type: 'bar',
                fontFamily: 'Roboto',
                background: theme.palette.background.paper,
                stacked: false,
                animations: {
                    enabled: false,
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
                        reset: true,
                    },
                },
            },
            xaxis: {
                type: 'datetime',
                crosshairs: {
                    show: true,
                    width: 1,
                    position: 'back',
                    opacity: 0.9,
                    stroke: {
                        color: '#b6b6b6',
                        width: 1,
                        dashArray: 3,
                    },
                },
            },
            yaxis: {
                labels: {
                    minWidth: 40,
                    formatter: function (value: number) {
                        if (value > 999) {
                            const result = (value / 1000).toFixed(1)
                            return `${result}k`
                        } else {
                            return value
                        }
                    },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '100%',
                },
            },
            stroke: {
                show: true,
                curve: 'straight',
                colors: undefined,
                width: 3,
                dashArray: [0],
            },
            dataLabels: {
                enabled: false,
            },
            tooltip: {
                shared: true,
                followCursor: true,
            },
            legend: {
                show: true,
                position: 'bottom',
            },
            grid: {
                borderColor: '#525252',
                strokeDashArray: 7,
            },
        },
        series: [
            {
                name: 'Confirmed cases: 7 days rolling average',
                data: this.props.confirmedChartDataSevenDaysRollingAverage?.map((chartData) => [chartData.unixMilliseconds, chartData.value]),
                type: 'line',
            },
            {
                name: 'Confirmed cases',
                data: this.props.confirmed?.map((chartData) => [chartData.unixMilliseconds, chartData.value]),
                type: 'bar',
            },
            {
                name: 'Confirmed cases still being updated',
                data: this.props.confirmedStillBeingUpdated?.map((chartData) => [chartData.unixMilliseconds, chartData.value]),
                type: 'bar',
            }
            // @Note: we are not displaying the following data for now, but we keep it around if we want to show it in the future.
        ],
    }
*/