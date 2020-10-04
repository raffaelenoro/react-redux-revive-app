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
  startDate: state.common.startDate,
  endDate: state.common.endDate,
  filters: state.common.filters
});

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, pager, payload) =>
    dispatch({ type: CHARTS_VIEW_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({ type: CHARTS_VIEW_UNLOADED })
});

class Charts extends React.Component {

    constructor(props) {
        super(props);

        // keep tabs of the time interval
        this.startDate = this.props.startDate;
        this.endDate = this.props.endDate;
        this.filters = this.props.filters;
    }

    fetchData() {
        const tab = "";
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const filters = this.props.filters;
        const pager = filters.length > 0 ? agent.Charts.filtered : agent.Charts.all;

        this.props.onLoad(
            tab,
            pager,
            Promise.all([
                pager(startDate, endDate, filters),
            ])
        );
    }

    componentDidMount() {
        this.fetchData()
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    componentDidUpdate() {
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const filters = this.props.filters;

        //
        // The component is out-of-date and needs a data refresh
        //
        if (this.startDate !== startDate || this.endDate !== endDate || this.filters !== filters) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.filters = filters;

            this.fetchData();
        }
    }

    render() {
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const filters = this.props.filters;
        const charts = this.props.charts;

        if (!charts) {
            return (
                <div>Loading Charts...</div>
            );
        } else if (this.startDate !== startDate || this.endDate !== endDate || this.filters !== filters) {
            // we need to re-fetch data before rendering
            return (
                <div>(Re)Loading Charts...</div>
            );
        } else {
            const offset = new Date().getTimezoneOffset() / 60;
            const begin = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), -offset);
            const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), -offset);

            charts.forEach(chart => {
                let data = chart.data;
                let x_data = data.x_data;
                let y_data = data.y_data;
                let i = 0;

                for (var date = new Date(begin); date <= end; ) {
                    if (x_data[i].substring(0,10) !== date.toISOString().substring(0, 10)) {
                        x_data.splice(i, 0, date.toISOString());
                        y_data.splice(i, 0, "0");
                    }
                    date.setDate(date.getDate() + 1);
                    i++;
                }
            });

            return (
                <div>
                    {
                    charts.sort(
                        (a, b) => (a.index - b.index)
                    ).map((chart, index) => {
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
                            <div className="row" key={"chart_area_" + chart.index} style={{border: "lightgray 1px solid", marginTop: 0}}>
                                <div className="col-md-3" style={{borderRight: "lightgray 1px solid", alignItems: "center"}}>
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
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
