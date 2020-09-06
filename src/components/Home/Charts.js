import { LineChart } from '../Chart';
import React from 'react';

const Charts = props => {
  const charts = props.charts;
  if (charts) {
    return (
      <div>
        {
          charts.map(chart => {
            return (
                <LineChart
                    key={"chart_" + chart.index}
                    chart={chart} />
            );
          })
        }
      </div>
    );
  } else {
    return (
      <div>Loading Charts...</div>
    );
  }
};

export default Charts;
