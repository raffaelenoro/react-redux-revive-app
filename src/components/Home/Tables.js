import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Table from '../Table';
import agent from '../../agent';
import { Loading } from './Loading';
import {
  TABLES_VIEW_LOADED,
  TABLES_VIEW_UNLOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.tableList,
  startDate: state.common.startDate,
  endDate: state.common.endDate,
  dimensions: state.common.dimensions,
  selectedDimension: state.common.selectedDimension,
  filters: state.common.filters
});

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, pager, payload) =>
    dispatch({ type: TABLES_VIEW_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({ type: TABLES_VIEW_UNLOADED })
});

class Tables extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lanes: window.innerWidth > 1400 ? 4 :
                   window.innerWidth > 1200 ? 3 :
                                              2
        };

        this.updateDimensions = this.updateDimensions.bind(this);

        // keep tabs of the time interval
        this.startDate = this.props.startDate;
        this.endDate = this.props.endDate;
        this.filters = this.props.filters;
        this.dimensions = this.props.dimensions;
        this.selectedDimension = this.props.selectedDimension;
        this.lanes = this.state.lanes;
    }

    fetchData() {
        const tab = "";
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const filters = this.props.filters;
        const pager = filters.length > 0 ? agent.Tables.filtered : agent.Tables.all;

        this.props.onLoad(
            tab,
            pager,
            Promise.all([
                pager(startDate, endDate, filters)
            ])
        );
    }

    updateDimensions() {
        const width = window.innerWidth;

        if (this.state.lanes === 2) {
            if (width > 1210) {
                this.setState({ lanes: 3});
            }
        } else if (this.state.lanes === 3) {
            if (width > 1410) {
                this.setState({ lanes: 4});
            }
            if (width < 1200) {
                this.setState({ lanes: 2});
            }
        } else {
            if (width < 1400) {
                this.setState({ lanes: 3});
            }
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);

        this.fetchData();
    }

    componentWillUnmount() {
        this.props.onUnload();

        window.removeEventListener("resize", this.updateDimensions);
    }

    componentDidUpdate() {
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const filters = this.props.filters;
        const dimensions = this.props.dimensions;
        const selectedDimension = this.props.selectedDimension;

        //
        // The component is out-of-date and needs a data refresh
        //
        if (this.startDate !== startDate || this.endDate !== endDate || this.filters !== filters) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.filters = filters;

            this.fetchData();
        }

        if (this.dimensions !== dimensions || this.selectedDimension !== selectedDimension || this.lanes !== this.state.lanes) {
            this.dimensions = dimensions;
            this.selectedDimension = selectedDimension;
            this.lanes = this.state.lanes;

            this.forceUpdate();
        }
    }

    render() {
        const props = this.props;
        const startDate = props.startDate;
        const endDate = props.endDate;
        const filters = props.filters;
        const tables = props.tables;
        const dimensions = props.dimensions;
        const selectedDimension = props.selectedDimension;
        const lanes = this.state.lanes;

        if (!tables || dimensions.length === 0 || !selectedDimension) {
            return (
                <Loading height={40} width={40} altText="Loading Tables ..." />
            );
        } else if (this.lanes !== this.state.lanes) {
            return (
                <Loading height={40} width={40} altText="Refreshing Tables ..." />
            );
        } else if (this.startDate !== startDate || this.endDate !== endDate || this.filters !== filters || this.dimensions !== dimensions || this.selectedDimension !== selectedDimension) {
            // we need to re-fetch data before rendering
            return (
                <Loading height={40} width={40} altText="(Re)Loading Tables ..." />
            );
        } else {
            const dimensionIndex = 2 + selectedDimension.index;
            const selectedName = "c" + dimensionIndex + "_name";
            const selectedData = "c" + dimensionIndex + "_data";
            const selectedUnit = "c" + dimensionIndex + "_unit"
            const className = lanes === 4 ? "col-md-3" :
                              lanes === 3 ? "col-md-4" :
                                            "col-md-6";

            const showTablesStride = pos => (
                tables
                    .sort(
                        (a, b) => (a.index - b.index)
                    ).filter(
                        (table, index) => (index % 4) === pos
                    ).map(
                        table => ({
                            index: table.index,
                            name: table.name,
                            c1_name: table.c1_name,
                            c2_name: table[selectedName],
                            c2_unit: table[selectedUnit],
                            data: table.data.map(d => ({
                                c1_data: d.c1_data,
                                c2_data: d[selectedData]
                            }))
                        })
                    ).map(table =>
                        <React.Fragment key={"table_area_" + table.index}>
                            <Table table={table} maxRows={12} />
                            <Link className="revive-link" to={{pathname: "/detailed/" + table.index}}>
                                ...
                            </Link>
                            <div style={{height: "1em"}}></div>
                        </React.Fragment>
                    )
            );

            return (
                <div>
                    <div className="row">
                        {[...Array(lanes).keys()].map(lane =>
                            <div key={"table_" + lane} className={className}>
                                {showTablesStride(lane)}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
