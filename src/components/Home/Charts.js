import { LineChart } from '../Chart';
import React from 'react';

const Charts = props => {
  const charts = props.charts;
  if (charts) {
    return (
      <div>
        {
          charts.map((chart, index) => {
            let units = chart.units;
            let total = chart.total;

            if (total > 1000000) {
                total = total / 1000000;
                total = total.toFixed(1) + "M"
            } else if (total > 1000) {
                total = total / 1000;
                total = total.toFixed(1) + "K"
            }

            if (units == "currency") {
                total = "$" + total;
            }

            return (
                <div className="row">
                    <div className="col-md-3" style={{border: "lightgray 1px solid", alignItems: "center"}}>
                        <p>{chart.name}</p>
                        <p style={{fontSize: "1.3em"}}>{total}</p>
                    </div>

                    <div className="col-md-9">
                        <LineChart
                            key={"chart_" + chart.index}
                            chart={chart}
                            first={index == 0} />
                    </div>
                </div>
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
