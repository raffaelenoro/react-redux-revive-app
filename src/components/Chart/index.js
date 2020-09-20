import React from 'react';
import Chart from "chart.js";

Chart.defaults.global.legend.display = false;
Chart.defaults.global.elements.line.tension = 0;

class LineChart extends React.PureComponent {

    chartRef = React.createRef();

    buildChart = () => {
        const chartRef2D = this.chartRef.current.getContext("2d");
        const props = this.props;
        const chart = props.chart;
        const data = chart.data;
        const offset = new Date().getTimezoneOffset() / 60;

        const xAxesCallback = (label, index, labels) => {

            if (index > .9 * labels.length) return "";

            let date = new Date(label);
            date.setHours(date.getHours() + offset);
            let dd = new Intl.DateTimeFormat('en', {
                day: '2-digit'
            }).format(date);
            let mm = new Intl.DateTimeFormat('en', {
                month: 'short'
            }).format(date);

            label = mm + ". " + dd;

            return label;
        };
        const yAxesCallback = (label, index, labels) => {

            const prefix = (chart.units == "currency" ? "$": " ");
            let suffix = "";

            label = +label;

            if (label >= 1000000) {
                label /= 1000000;
                suffix = "M"
            } else {
                if (label >= 1000) {
                    label /= 1000;
                    suffix = "K"
                }
            }

            return (prefix + label + suffix).padStart(7);
        }

        new Chart(chartRef2D, {
            type: "line",
            data: {
                //Bring in data
                labels: data.x_data,
                datasets: [
                    {
                        label: chart.name,
                        data: data.y_data,
                        pointRadius: 1
                    }
                ]
            },
            options: {
                //Customize chart options
                responsive: true,
                scales: {
                    xAxes: [{
                        position: 'top',
                        ticks: {
                            maxTicksLimit: 5,
                            maxRotation: 0,
                            autoSkipPadding: 10,
                            labelOffset: 20,
                            callback: xAxesCallback,
                            fontSize: 9,
                            lineHeight: props.first ? 1.1 : 0,
                            fontColor: props.first ? "#666": "rgba(0,0,0,0)"
                        }
                    }],
                    yAxes: [{
                        position: 'right',
                        ticks: {
                            maxTicksLimit: 5,
                            fontSize: 9,
                            callback: yAxesCallback
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        title: () => false,
                        label: (item, data) => data.datasets[item.datasetIndex].data[item.index]
                    }
                }
            }
        });
    }

    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        this.buildChart();
    }

    render() {
        const chart = this.props.chart;

        return (
            <canvas
                id={"chart_" + chart.index}
                ref={this.chartRef}/>
        );
    }
};

export { LineChart };
