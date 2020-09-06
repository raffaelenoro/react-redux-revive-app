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
        const xAxesCallback = (label, index, labels) => {
            let date = new Date(label);
            let dd = new Intl.DateTimeFormat('en', {
                day: '2-digit'
            }).format(date);
            let mm = new Intl.DateTimeFormat('en', {
                month: 'short'
            }).format(date);

            if (index > 0 && index < .9 * labels.length ) {
                label = mm + ". " + dd;
            } else {
                label = "";
            }

            return props.first ? label : "";
        };

        new Chart(chartRef2D, {
            type: "line",
            data: {
                //Bring in data
                labels: data.x_data,
                datasets: [
                    {
                        label: chart.name,
                        data: data.y_data,
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
                            callback: xAxesCallback
                        }
                    }],
                    yAxes: [{
                        position: 'right',
                        ticks: {
                            maxTicksLimit: 5
                        }
                    }]
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
