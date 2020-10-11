import React from 'react';
import Chart from "chart.js";

Chart.defaults.global.legend.display = false;
Chart.defaults.global.elements.line.tension = 0;
Chart.plugins.register({
   afterDatasetsDraw: function(chart, evt) {
      if (chart.tooltip._active && chart.tooltip._active.length) {
         var activePoint = chart.tooltip._active[0],
            ctx = chart.ctx,
            y_axis = chart.scales['y-axis-0'],
            x = activePoint.tooltipPosition().x,
            topY = y_axis.top,
            bottomY = y_axis.bottom;
         // draw line
         ctx.save();
         ctx.beginPath();
         ctx.moveTo(x, topY);
         ctx.lineTo(x, bottomY);
         ctx.lineWidth = 2;
         ctx.strokeStyle = 'gray';
         ctx.stroke();
         ctx.restore();
      }
   }
});

class LineChart extends React.PureComponent {

    chartRef = React.createRef();

    buildChart = () => {
        const chartRef2D = this.chartRef.current.getContext("2d");
        const props = this.props;
        const chart = props.chart;
        const data = chart.data;
        const offset = new Date().getTimezoneOffset() / 60;

        const formatValue = (value, decimals) => {
            const prefix = (chart.units === "currency" ? "$": " ");
            let suffix = "";

            value = +value;

            if (value >= 1000000) {
                value /= 1000000;
                suffix = "M"
            } else {
                if (value >= 1000) {
                    value /= 1000;
                    suffix = "K"
                }
            }

            return prefix + value.toFixed(chart.units === "integer"? 0 : decimals) + suffix;
        }

        const xAxesCallback = (label, index, labels) => {

            if (index > .8 * labels.length) return "";

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
        const yAxesCallback = (label, index, labels) => formatValue(label, 0).padStart(7);

        new Chart(chartRef2D, {
            type: "line",
            data: {
                //Bring in data
                labels: data.x_data,
                datasets: [
                    {
                        label: chart.name,
                        data: data.y_data,
                        pointRadius: 1,
                        borderColor: "rgb(26, 188, 156)",
                        backgroundColor: "ghostwhite"
                    }
                ]
            },
            options: {
                //Customize chart options
                responsive: true,
                layout: {
                    padding: {
                        bottom: 8,
                        right: 8
                    }
                },
                scales: {
                    xAxes: [{
                        position: 'top',
                        gridLines: {
                            tickMarkLength: 0
                        },
                        ticks: {
                            maxTicksLimit: 5,
                            maxRotation: 0,
                            autoSkipPadding: 10,
                            labelOffset: 20,
                            callback: xAxesCallback,
                            fontSize: 9,
                            lineHeight: props.first ? 1.1 : 0,
                            fontColor: props.first ? "#666": "rgba(0,0,0,0)",
                        }
                    }],
                    yAxes: [{
                        position: 'right',
                        gridLines: {
                            tickMarkLength: 0
                        },
                        ticks: {
                            maxTicksLimit: 5,
                            fontSize: 9,
                            callback: yAxesCallback
                        },
                        afterSetDimensions: function(axes) {
                            axes.maxWidth = 24;
                        }
                    }]
                },
                tooltips: {
                    intersect: false,
                    mode: 'index',
                    callbacks: {
                        title: () => false,
                        label: (item, data) => formatValue(item.value, 2),
                        labelColor: (tooltipItem, chart) => ({
                            borderColor: 'rgb(26, 188, 156)',
                            backgroundColor: 'rgb(26, 188, 156)'
                        })
                    },
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
