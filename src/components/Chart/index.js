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
         ctx.strokeStyle = '#07C';
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

            const prefix = (chart.units === "currency" ? "$": " ");
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

        let chartObj = null;
        let imageData = null;
        const onHover = (event, array) => {
            const x = event.offsetX;
            const ctx = chartObj.ctx;
            const x_axis = chartObj.scales['x-axis-0'];
            const y_axis = chartObj.scales['y-axis-0'];
            const left = x_axis.left;
            const right = x_axis.right;
            const top = y_axis.top;
            const bottom = y_axis.bottom;

            if (!imageData) {
                imageData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
            } else {
                ctx.putImageData(imageData, 0, 0);
            }

            if (x > left && x < right) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, top);
                ctx.lineTo(x, bottom);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#07C';
                ctx.stroke();
                ctx.restore();
            }
        };

        chartObj = new Chart(chartRef2D, {
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
                onHover: onHover,
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
