import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { AppState } from '../store/rootReducer'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { HcdTestData } from '../../entities/HcdTestData'
import { FinnishCoronaData } from '../../entities/FinnishCoronaData'
import { fetchData, fetchHcdTestData, fetchTHLData } from '../../features/dashboard/actions/dataActions'
import { getData, getHcdTestData, getLoadingData, getLoadingDataError, getLoadingHcdTestData, getLoadingHcdTestDataError, getLoadingThlTestData, getLoadingThlTestDataError, getThlTestData } from '../../features/dashboard/reducers/dashboardReducer'
import { ThlTestData } from '../../entities/ThlTestData'

export interface ApplicationComponentProps extends RouteComponentProps {
    loadingFinnishCoronaData: boolean;
    loadingHcdTestData: boolean;
    loadingThlTestData: boolean;
    finnishCoronaData: FinnishCoronaData | undefined;
    hcdTestData: HcdTestData | undefined;
    thlTestData: ThlTestData | undefined
    loadingDataError: string | undefined;
    loadingHcdTestDataError: string | undefined;
    loadingThlTestDataError: string | undefined;
    onFetchData: () => any;
    onFetchHcdTestData: () => any;
    onFetchThlData: () => any;
}

export interface ApplicationComponentState {
    shouldComponentRender: boolean;
}

class ApplicationComponent extends React.Component<ApplicationComponentProps, ApplicationComponentState> {
    constructor(props: Readonly<ApplicationComponentProps>) {
        super(props)
        this.isLoading = this.isLoading.bind(this)
        const { onFetchData, onFetchHcdTestData, onFetchThlData } = this.props
    
        onFetchData()
        onFetchHcdTestData()
        onFetchThlData()
    }

    isLoading(): boolean {
        const { 
            loadingHcdTestData, 
            loadingFinnishCoronaData,
            loadingThlTestData,
        } = this.props

        if (loadingHcdTestData === true || loadingFinnishCoronaData === true || loadingThlTestData === true) {
            return true
        }

        return false
    }

    error(): boolean {
        const {
            loadingDataError,
             loadingHcdTestDataError,
            loadingThlTestDataError,
        } = this.props

        if (loadingDataError || loadingHcdTestDataError || loadingThlTestDataError) {
            return true
        }

        return false
    }

    render() {
        const { children } = this.props
        let content: React.ReactNode

        if (this.isLoading()) {
            content = (
                <main>
                    <div className="h-screen w-screen flex flex-row	justify-center items-center text-purple-400">
                        <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </main>
            )
        } else if (this.error()) {
            content = (
                <div className="h-screen w-screen flex flex-row	justify-center items-center">
                    <div className="flex flex-col items-center">
                        <div className="text-sm font-sans text-red-400">An error occurred while fetching data</div>
                        <div className="text-sm font-sans text-red-400">Please try again later</div>
                    </div>
                </div>
            )
        } else {
            content = (
                <main>{children}</main>
            );
        }

        return (
            <div className="bg-gray-900">
                {content}
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    loadingFinnishCoronaData: getLoadingData(state),
    loadingHcdTestData: getLoadingHcdTestData(state),
    loadingThlTestData: getLoadingThlTestData(state),
    finnishCoronaData: getData(state),
    hcdTestData: getHcdTestData(state),
    thlTestData: getThlTestData(state),

    loadingDataError: getLoadingDataError(state),
    loadingHcdTestDataError: getLoadingHcdTestDataError(state),
    loadingThlTestDataError: getLoadingThlTestDataError(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onFetchData: () => {
            dispatch(fetchData())
        },
        onFetchHcdTestData: () => {
            dispatch(fetchHcdTestData())
        },
        onFetchThlData: () => {
            dispatch(fetchTHLData())
        },
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ApplicationComponent))
