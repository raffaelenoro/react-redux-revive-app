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

const threshold2to3 = 1200;
const threshold3to4 = 1450;

class Tables extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lanes: window.innerWidth > threshold3to4 ? 4 :
                   window.innerWidth > threshold2to3 ? 3 :
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
            if (width > (threshold2to3 + 10)) {
                this.setState({ lanes: 3});
            }
        } else if (this.state.lanes === 3) {
            if (width > (threshold3to4 + 10)) {
                this.setState({ lanes: 4});
            }
            if (width < threshold2to3) {
                this.setState({ lanes: 2});
            }
        } else {
            if (width < threshold3to4) {
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

            const showTablesStride = pos => (
                tables
                    .sort(
                        (a, b) => (a.index - b.index)
                    ).filter(
                        (table, index) =>
                            index >= Math.floor(pos * tables.length / lanes) && index < Math.floor((pos + 1) * tables.length / lanes)
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
                    <div className={"grid-container-tables-" + lanes}>
                        {[...Array(lanes).keys()].map(lane =>
                            <div key={"table_" + lane}>
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
