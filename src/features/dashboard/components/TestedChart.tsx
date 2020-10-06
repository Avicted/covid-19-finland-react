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

interface TestedChartProps {
    classes: Record<string, string>;
    title: string;
    tests: ChartData[] | undefined;
}

interface TestedChartPropsState {
    options: any;
    series: any;
    anchorEl: any;
}

class TestedChart extends Component<TestedChartProps, TestedChartPropsState> {
    state = {
        anchorEl: null,
        options: {
            theme: {
                mode: 'dark',
            },
            colors: ['rgba(255, 213, 79, 1)'],
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
            dataLabels: {
                enabled: false,
            },
            tooltip: {
                shared: true,
                followCursor: true,
                y: {
                    formatter: function (value: number) {
                        return value;
                    },
                },
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
                name: 'Tests',
                data: this.props.tests?.map((chartData) => [chartData.unixMilliseconds, chartData.value]),
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
        const { classes, title } = this.props
        return (
            <div>
                <Card className={classes.card}>
                    <CardContent className={classes.cardcontent}>
                        <Typography className={classes.title} gutterBottom>
                            {title}
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
})

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {}
}

const connector = connect(mapStatesToProps, mapDispatchToProps)
export default connector(withStyles(styles)(TestedChart))
