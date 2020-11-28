import React from 'react'

interface FooterProps {}

export const Footer: React.FunctionComponent<FooterProps> = () => {
    return (
        <div className="grid grid-flow-row justify-center justify-items-center font-sans mt-5 mb-5">
            <a className="font-sm text-purple-400 hover:text-gray-300 pb-2" href="https://github.com/Avicted/covid-19-finland-react">
                Source code
            </a>
            <p className="font-sm text-white pb-2">
                <a className="text-purple-400 hover:text-gray-300" href="https://github.com/HS-Datadesk/koronavirus-avoindata">Finland data source</a>
                {' '}| Helsingin Sanomat
            </p>
            <p className="font-sm text-white pb-2">
                Developed by:{' '}
                <a className="text-purple-400 hover:text-gray-300" href="https://twitter.com/Victoranderssen">Victor Anderssén</a>
            </p>
        </div>
    )
}
