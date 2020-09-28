import React from 'react'
import {
    Card,
    Typography,
    CardContent,
    Theme,
    StyleRules,
    createStyles,
    withStyles,
} from '@material-ui/core'
import ReactApexChart from 'react-apexcharts'
import { connect } from 'react-redux'
import { getConfirmedChartData, getConfirmedChartDataSevenDaysRollingAverage, getDeathsChartData, getRecoveredChartData } from '../reducers/dashboardReducer'
import { AppState } from '../../../framework/store/rootReducer'
import { Dispatch } from 'redux'
import theme from '../../../theme/theme'
import { ChartData } from '../../../entities/ChartData'

const styles: (theme: Theme) => StyleRules<string> = () =>
    createStyles({
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
    })

interface CasesByDayChartProps {
    classes: Record<string, string>;
    confirmedChartDataSevenDaysRollingAverage: ChartData[] | undefined;
    confirmed: ChartData[] | undefined; 
    recovered: ChartData[] | undefined;
    deaths: ChartData[] | undefined;
}

interface CasesByDayChartState {
    options: any
    series: any
    anchorEl: any
}

class CasesByDayChartView extends React.Component<CasesByDayChartProps, CasesByDayChartState> {
    state = {
        anchorEl: null,
        options: {
            theme: {
                mode: 'dark',
            },
            colors: [
                'rgba(255, 255, 255, 1)', 
                'rgba(106, 73, 156, 1)', 
                'rgba(129, 199, 132, 1)', 
                'rgba(229, 115, 115, 1)',
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
                tickPlacement: 'on',
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
                name: 'Recovered',
                data: this.props.recovered?.map((chartData) => [chartData.unixMilliseconds, chartData.value]),
                type: 'bar',
            },
            {
                name: 'Deaths',
                data: this.props.deaths?.map((chartData) => [chartData.unixMilliseconds, chartData.value]),
                type: 'bar',
            },
        ],
    }

    handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        this.setState({
            anchorEl: event.currentTarget,
        })
    }

    handleClose(event: any) {
        this.setState({
            anchorEl: null,
        })
    }

    render() {
        const { classes } = this.props
        return (
            <div>
                <Card className={classes.card}>
                    <CardContent className={classes.cardcontent}>
                        <Typography className={classes.title} gutterBottom>
                            Cases by day
                        </Typography>
                        <div className={classes.chart}>
                            <ReactApexChart
                                options={this.state.options}
                                series={this.state.series}
                                type={this.state.options.chart.type as any}
                                width="100%"
                                height={300}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

const mapStatesToProps = (state: AppState) => ({
    confirmedChartDataSevenDaysRollingAverage: getConfirmedChartDataSevenDaysRollingAverage(state),
    confirmed: getConfirmedChartData(state),
    recovered: getRecoveredChartData(state),
    deaths: getDeathsChartData(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {}
}

const connector = connect(mapStatesToProps, mapDispatchToProps)
export default connector(withStyles(styles)(CasesByDayChartView))
