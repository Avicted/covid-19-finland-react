import React from 'react'
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
const colors = require('tailwindcss/colors')

interface DataPoint {
    unixMilliseconds: number;
    confirmed: number | undefined;
    recovered: number;
    deaths: number;
}

interface CasesByDayChartCumulativeChartProps { 
    logarithmic?: boolean;
}

export const CasesByDayChartCumulativeChart: React.FunctionComponent<CasesByDayChartCumulativeChartProps> = ({
    logarithmic,
}) => {
    const confirmed: ChartData[] | undefined = useSelector((state: AppState) => getConfirmedChartDataCumulative(state));
    const deaths: ChartData[] | undefined = useSelector((state: AppState) => getDeathsChartDataCumulative(state));
    const recovered: ChartData[] | undefined = useSelector((state: AppState) => getRecoveredChartDataCumulative(state));

    const chartData = (confirmed: ChartData[], deaths: ChartData[], recovered: ChartData[]): any => {
        const result: DataPoint[] = [];

        for (let i = 0; i < confirmed.length; i++) {
            const recoveredValue: number | undefined = recovered.find((d: ChartData) => d.unixMilliseconds === confirmed[i].unixMilliseconds)?.value;
            const deathsValue: number | undefined = deaths.find((d: ChartData) => d.unixMilliseconds === confirmed[i].unixMilliseconds)?.value;

            const dataPoint: DataPoint = {
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
                <div className="bg-gray-900 p-2 text-xs rounded">
                    <p className="pb-2">{`${format(new Date(unixMilliseconds), 'dd MMM yyyy')}`}</p>
                    {payload.map((p: TooltipPayload, index: number) => (
                        <p className="pt-0.5 pb-0.5" style={{ color: p.color }} key={index}>
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
                <h1 className="text-sm text-white pb-4">Cases by day (cumulative)</h1>
                {(confirmed !== undefined && deaths !== undefined && recovered !== undefined) && (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={chartData(confirmed, deaths, recovered)}
                            margin={{
                                top: 0, right: 0, left: 0, bottom: 0,
                            }}
                            className="text-sm"
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
                            <Tooltip content={renderTooltip} cursor={{fill: colors.coolGray[700] }} />
                            <Legend
                                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                                formatter={(value, entry, index) => {
                                    return value.charAt(0).toUpperCase() + value.slice(1);
                                }}
                            />

                            <Line
                                dataKey="confirmed"
                                stroke={colors.purple[300]}
                                strokeWidth={2}
                                name="Confirmed"
                                dot={false}
                            />
                            <Line
                                dataKey="recovered"
                                stroke={colors.green[300]}
                                strokeWidth={2}
                                name="Recovered"
                                dot={false}
                            />
                            <Line
                                dataKey="deaths"
                                stroke={colors.red[300]}
                                strokeWidth={2}
                                name="Deaths"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
