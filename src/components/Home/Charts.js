import { LineChart } from '../Chart';
import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import {
  CHARTS_VIEW_LOADED,
  CHARTS_VIEW_UNLOADED,
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.chartList,
  startDate: state.date.startDate,
  endDate: state.date.endDate
});

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, pager, payload) =>
    dispatch({ type: CHARTS_VIEW_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({ type: CHARTS_VIEW_UNLOADED })
});

class Charts extends React.Component {

    componentDidMount() {
        const tab = "";
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;

        this.props.onLoad(
            tab,
            agent.Charts.all,
            Promise.all([
                agent.Charts.all(startDate, endDate),
            ])
        );
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        const charts = this.props.charts;
  
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

                    if (units === "currency") {
                        total = "$" + total;
                    }

                    return (
                        <div className="row" key={"chart_area_" + chart.index}>
                            <div className="col-md-3" style={{border: "lightgray 1px solid", alignItems: "center"}}>
                                <p>{chart.name}</p>
                                <p style={{fontSize: "1.3em"}}>{total}</p>
                            </div>

                            <div className="col-md-9">
                                <LineChart
                                    key={"chart_" + chart.index}
                                    chart={chart}
                                    first={index === 0} />
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
