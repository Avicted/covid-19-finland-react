import React from 'react'
import { Theme, createStyles, withStyles, CssBaseline, ThemeProvider, CircularProgress } from '@material-ui/core'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import theme from '../../theme/theme'
import { Footer } from './Footer'
import { AppState } from '../store/rootReducer'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { HcdTestData } from '../../entities/HcdTestData'
import { FinnishCoronaData } from '../../entities/FinnishCoronaData'
import { fetchData, fetchHcdTestData, fetchTHLData } from '../../features/dashboard/actions/dataActions'
import { getData, getHcdTestData, getLoadingData, getLoadingHcdTestData, getLoadingThlTestData, getThlTestData } from '../../features/dashboard/reducers/dashboardReducer'
import { ThlTestData } from '../../entities/ThlTestData'

const styles = (theme: Theme) =>
    createStyles({
        root: {
            height: '100vh',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
        },
        main: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
        },
        loader: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '50vh',
        },
    })

export interface ApplicationComponentProps extends RouteComponentProps {
    classes: Record<string, string>;
    loadingFinnishCoronaData: boolean;
    loadingHcdTestData: boolean;
    loadingThlTestData: boolean;
    finnishCoronaData: FinnishCoronaData | undefined;
    hcdTestData: HcdTestData | undefined;
    thlTestData: ThlTestData | undefined
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
        this.shouldComponentRender = this.shouldComponentRender.bind(this)
        const { onFetchData, onFetchHcdTestData, onFetchThlData } = this.props
    
        onFetchData()
        onFetchHcdTestData()
        onFetchThlData()
    }

    shouldComponentRender() {
        const { 
            loadingHcdTestData, 
            loadingFinnishCoronaData,
            loadingThlTestData,
            hcdTestData, 
            finnishCoronaData,
            thlTestData,
        } = this.props

        if (loadingHcdTestData === true || loadingFinnishCoronaData === true || loadingThlTestData === true) {
            return false
        } else if (hcdTestData === undefined || finnishCoronaData === undefined || thlTestData === undefined) {
            return false
        } else if (Object.keys(hcdTestData).length === 0 || finnishCoronaData.confirmed.length === 0) {
            return false
        } else {
            return true
        }
    }

    render() {
        const { classes, children } = this.props
        let content: React.ReactNode

        if (!this.shouldComponentRender()) {
            content = (
                <main className={classes.main}>
                    <div className={classes.loader}>
                        <CircularProgress />
                    </div>
                </main>
            )
        } else {
            content = (
                <>
                    <main className={classes.main}>{children}</main>
                    <Footer />
                </>
            );
        }

        return (
            <div className={classes.root}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {content}
                </ThemeProvider>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ApplicationComponent)))
