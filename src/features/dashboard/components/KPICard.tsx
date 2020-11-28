import React from 'react'

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
    return (
        <div className="flex flex-row dark bg-gray-800 shadow-sm rounded p-4">
            <div className="flex flex-col flex-grow ml-4 justify-between">
                <div className="text-sm text-white">{title}</div>
                <div className={`font-bold text-2xl ${color}`}>{data}</div>
            </div>
        </div>
    )
}
