import React, { Component } from 'react'
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
import { Dispatch } from 'redux'
import { getInfectionsByHealthCareDistrictChartData } from '../reducers/dashboardReducer'
import { AppState } from '../../../framework/store/rootReducer'
import theme from '../../../theme/theme'

const styles: (theme: Theme) => StyleRules<string> = () =>
    createStyles({
        cardcontent: {
            '&:last-child': {
                paddingBottom: 12,
            },
        },
        card: {
            minHeight: 400,
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

interface CasesByHealthCareDistrictChartProps {
    classes: Record<string, string>;
    series: any;
    labels: any;
}

interface CasesByHealthCareDistrictChartState {
    options: any
    series: any
    anchorEl: any
}

class CasesByHealthCareDistrictChart extends Component<CasesByHealthCareDistrictChartProps, CasesByHealthCareDistrictChartState> {
    state = {
        anchorEl: null,
        options: {
            theme: {
                mode: 'dark',
            },
            colors: [
                '#e57373',
                '#f06292',
                '#ba68c8',
                '#9575cd',
                '#7986cb',
                '#64b5f6',
                '#4fc3f7',
                '#4dd0e1',
                '#4db6ac',
                '#81c784',
                '#aed581',
                '#dce775',
                '#fff176',
                '#ffd54f',
                '#ffb74d',
                '#ff8a65',
                '#a1887f',
            ],
            chart: {
                stacked: false,
                background: theme.palette.background.paper,
                type: 'bar',
                animations: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: true,
                textAnchor: 'middle',
                offsetY: -20,
                style: {
                    fontSize: '10px',
                },
                formatter: function (value: number) {
                    if (value > 999) {
                        const result = (value / 1000).toFixed(0)
                        return `${result}k`
                    } else {
                        return value
                    }
                },
            },
            legend: {
                show: true,
                position: 'right',
            },
            grid: {
                borderColor: '#525252',
                strokeDashArray: 7,
            },
            xaxis: {
                type: 'category',
                categories: this.props.labels,
                labels: {
                    show: false,
                },
            },
            yaxis: {
                labels: {
                    minWidth: 40,
                    formatter: function (value: number) {
                        if (value > 999) {
                            const result = (value / 1000).toFixed(0)
                            return `${result}k`
                        } else {
                            return value
                        }
                    },
                },
            },
            plotOptions: {
                bar: {
                    columnWidth: '100%',
                    dataLabels: {
                        position: 'top',
                    },
                },
            },
            responsive: [
                {
                    breakpoint: 1400,
                    options: {
                        legend: {
                            show: true,
                            position: 'bottom',
                            itemMargin: {
                                horizontal: 3,
                                vertical: 3,
                            },
                        },
                    },
                },
            ],
            tooltip: {
                fillSeriesColor: false,
                x: {
                    show: false,
                },
            },
        },
        series: this.props.series,
    }

    render() {
        const { classes } = this.props

        return (
            <div>
                <Card className={classes.card}>
                    <CardContent className={classes.cardcontent}>
                        <Typography className={classes.title} gutterBottom>
                            Infections by health care district
                        </Typography>
                        <div className={classes.chart}>
                            <ReactApexChart
                                options={this.state.options}
                                series={this.state.series}
                                type={this.state.options.chart.type as any}
                                width="100%"
                                height={400}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

const mapStatesToProps = (state: AppState) => ({
    series: getInfectionsByHealthCareDistrictChartData(state)?.series,
    labels: getInfectionsByHealthCareDistrictChartData(state)?.labels,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {}
}

const connector = connect(mapStatesToProps, mapDispatchToProps)
export default connector(withStyles(styles)(CasesByHealthCareDistrictChart))