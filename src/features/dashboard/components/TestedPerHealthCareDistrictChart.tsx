import React from 'react'
import { TestsByHealthCareDistrictChartData } from '../../../entities/TestsByHealthCareDistrictChartData';
import { getTestsPerHealthCareDistrictChartData } from '../reducers/dashboardReducer';
import { useSelector } from 'react-redux';
import { AppState } from '../../../framework/store/rootReducer';
import { Bar, BarChart, CartesianGrid, Cell, Legend, LegendPayload, ResponsiveContainer, Tooltip, TooltipPayload, TooltipProps, YAxis } from 'recharts';
import { getColor } from '../../../utils';
const colors = require('tailwindcss/colors')


interface TestedPerHealthCareDistrictChartProps { }

export const TestedPerHealthCareDistrictChart: React.FunctionComponent<TestedPerHealthCareDistrictChartProps> = () => {
    const data: TestsByHealthCareDistrictChartData[] | undefined = useSelector((state: AppState) => getTestsPerHealthCareDistrictChartData(state));

    const renderTooltip = ({ active, payload, label }: TooltipProps): JSX.Element | null => {
        if (active && payload !== undefined) {
            return (
                <div className="bg-gray-900 p-2 text-xs rounded">
                    {payload.map((p: TooltipPayload, index: number) => (
                        <p className="pt-0.5 pb-0.5" key={index}>
                            {p.payload.name}: <b style={{ color: getColor(data?.findIndex(data => data.name === p.payload.name)) }}>{`${p.value}`}</b>
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
            <h1 className="text-sm text-white pb-4">Tests by health care district</h1>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 0, right: 0, left: 0, bottom: 10,
                        }}
                        className="text-sm text-white"
                    >
                        <CartesianGrid
                            strokeDasharray="8 8"
                            vertical={false}
                            stroke={colors.coolGray[700]}
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

                        <Tooltip content={renderTooltip} cursor={{ fill: colors.coolGray[700] }} />

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
        </div>
    )
}
