import React from 'react'
import { ChartData } from '../../../entities/ChartData'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
const colors = require('tailwindcss/colors')


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
    const renderTooltip = ({ active, payload, label }: any): JSX.Element | null => {
        if (active) {
            const unixMilliseconds: number = payload[0].payload.unixMilliseconds;
            const value: number = payload[0].payload.value;
            const color: string = payload[0].color;

            return (
                <div className="bg-gray-900 p-2 text-xs rounded">
                    <p className="pb-2">{`${format(new Date(unixMilliseconds), 'dd MMM yyyy')}`}</p>
                    <p className="pt-0.5 pb-0.5" style={{ color: color }}>
                        Tested: <b>{`${value}`}</b>
                    </p>
                </div>
            );
        }

        return null;
    }

    return (
        <div className="block flex-row dark bg-gray-800 shadow-sm rounded p-4 text-white font-sans">
            <div className="flex flex-col flex-grow">
                <h1 className="text-sm text-white pb-4">{title}</h1>
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
                        className="text-sm"
                    >
                        <CartesianGrid
                            strokeDasharray="8 8"
                            vertical={false}
                            stroke={colors.coolGray[700]}
                        />
                        <XAxis
                            stroke={colors.coolGray[400]}
                            dataKey="unixMilliseconds"
                            tickFormatter={unixMilliseconds => format(new Date(unixMilliseconds), 'MMM yy')}
                            name="Date"
                            minTickGap={40}
                        />
                        <YAxis
                            stroke={colors.coolGray[400]}
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
                        <Tooltip content={renderTooltip} cursor={{fill: colors.coolGray[700] }} />
                        <Legend
                            wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                            formatter={(value, entry, index) => {
                                return 'Tested'
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill={colors.yellow[300]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
