import React from 'react'
import { useSelector } from 'react-redux'
import { getConfirmedChartData, getConfirmedChartDataSevenDaysRollingAverage, getConfirmedStillBeingUpdated } from '../reducers/dashboardReducer'
import { AppState } from '../../../framework/store/rootReducer'
import { ChartData } from '../../../entities/ChartData'
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, TooltipPayload, TooltipProps, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'
const colors = require('tailwindcss/colors')


interface DataPoint {
    unixMilliseconds: number;
    confirmed: number | undefined;
    confirmedChartDataSevenDaysRollingAverage: number;
    confirmedStillBeingUpdated: number;
}

interface CasesByDayChartProps { }

export const CasesByDayChart: React.FunctionComponent<CasesByDayChartProps> = () => {
    const confirmedChartDataSevenDaysRollingAverage: ChartData[] | undefined = useSelector((state: AppState) => getConfirmedChartDataSevenDaysRollingAverage(state));
    const confirmed: ChartData[] | undefined = useSelector((state: AppState) => getConfirmedChartData(state));
    const confirmedStillBeingUpdated: ChartData[] | undefined = useSelector((state: AppState) => getConfirmedStillBeingUpdated(state));

    const chartData = (confirmedChartDataSevenDaysRollingAverage: ChartData[], confirmed: ChartData[], confirmedStillBeingUpdated: ChartData[]): any => {
        const result: DataPoint[] = [];

        for (let i = 0; i < confirmed.length; i++) {
            const confirmedChartDataSevenDaysRollingAverageValue: number | undefined = confirmedChartDataSevenDaysRollingAverage.find((d: ChartData) => d.unixMilliseconds === confirmed[i].unixMilliseconds)?.value;
            const confirmedStillBeingUpdatedValue: number | undefined = confirmedStillBeingUpdated.find((d: ChartData) => d.unixMilliseconds === confirmed[i].unixMilliseconds)?.value;

            const dataPoint: DataPoint = {
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
                <div className="bg-gray-900 p-2 text-xs rounded">
                    <p className="pb-2">{`${format(new Date(unixMilliseconds), 'dd MMM yyyy')}`}</p>
                    {payload.map((p: TooltipPayload, index: number) => (
                        <p className={`pt-0.5 pb-0.5`} style={{ color: p.color }} key={index}>
                            {p.name}: <b>{`${p.value}`}</b>
                        </p>
                    ))}
                </div>
            );
        };

        return null;
    }

    return (
        <div className="block flex-row dark bg-gray-800 shadow-sm rounded p-4 text-white font-sans">
            <div className="flex flex-col flex-grow">
                <h1 className="text-sm text-white pb-4">Cases by day</h1>
                {(confirmedChartDataSevenDaysRollingAverage !== undefined && confirmed !== undefined && confirmedStillBeingUpdated !== undefined) && (
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart
                            data={chartData(confirmedChartDataSevenDaysRollingAverage, confirmed, confirmedStillBeingUpdated)}
                            margin={{
                                top: 0, right: 0, left: 0, bottom: 0,
                            }}
                            className="text-sm"
                            barSize={200}
                        >
                            <CartesianGrid
                                strokeDasharray="8 8"
                                vertical={false}
                                stroke={colors.coolGray[700]}
                            />
                            <XAxis
                                dataKey="unixMilliseconds"
                                tickFormatter={unixMilliseconds => format(new Date(unixMilliseconds), 'MMM yy')}
                                name="Date"
                                minTickGap={40}
                                stroke={colors.coolGray[400]}
                            />
                            <YAxis
                                stroke={colors.coolGray[400]}
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
                            <Tooltip content={renderTooltip} cursor={{fill: colors.coolGray[700] }} />
                            <Legend
                                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                                formatter={(value, entry, index) => {
                                    return value.charAt(0).toUpperCase() + value.slice(1);
                                }}
                            />

                            <Bar
                                dataKey="confirmed"
                                name="Confirmed"
                                fill={colors.purple[500]}
                            />
                            <Bar
                                dataKey="confirmedStillBeingUpdated"
                                name="Confirmed cases still being updated"
                                fill={colors.gray[300]}
                            />
                            <Line
                                dataKey="confirmedChartDataSevenDaysRollingAverage"
                                name="Confirmed cases 7 days rolling average"
                                stroke={colors.purple[300]}
                                strokeWidth={2}
                                dot={false}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}
