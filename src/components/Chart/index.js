import React from 'react';
import Chart from "chart.js";

Chart.defaults.global.legend.display = false;
Chart.defaults.global.elements.line.tension = 0;

class LineChart extends React.Component {

    chartRef = React.createRef();

    componentDidMount() {
        const chartRef2D = this.chartRef.current.getContext("2d");
        const chart = this.props.chart;
        const data = chart.data;

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
            }
        });
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
