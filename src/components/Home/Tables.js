import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Table from '../Table';
import agent from '../../agent';
import Select from 'react-select';
import {
  TABLES_VIEW_LOADED,
  TABLES_VIEW_UNLOADED,
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.tableList,
  startDate: state.common.startDate,
  endDate: state.common.endDate,
  filters: state.filterList.filters
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
        const pager = filters.length > 0 ? agent.Tables.filtered : agent.Tables.all;

        this.props.onLoad(
            tab,
            pager,
            Promise.all([
                pager(startDate, endDate, filters)
            ])
        );
    }

    componentDidMount() {
        this.fetchData();
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
        if (this.startDate !== startDate || this.endDate !== endDate || this.filters != filters) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.filters = filters;

            this.fetchData();
        }
    }

    render() {
        const props = this.props;
        const startDate = props.startDate;
        const endDate = props.endDate;
        const filters = props.filters;
        const dimensions = [{label: "Billed", value: "billed"}];
        const tables = props.tables;
        const showTablesStride = pos => (
            tables
                .sort(
                    (a, b) => (a.index - b.index)
                ).filter(
                    (table, index) => (index % 4) === pos
                ).map(
                    table => (
                        <React.Fragment key={"table_area_" + table.index}>
                            <Table table={table} maxRows={12}/>
                            <Link to={{pathname: "/detailed", state: {index: table.index}}}>...</Link>
                            <div style={{height: "1em"}}></div>
                        </React.Fragment>
                    )
                )
        );

        if (!tables) {
            return (
                <div>Loading Tables...</div>
            );
        } else if (this.startDate !== startDate || this.endDate !== endDate || this.filters != filters) {
            // we need to re-fetch data before rendering
            return (
                <div>(Re)Loading Tables...</div>
            );
        } else {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-6"></div>
                        <div className="col-md-3">
                            Dimension by: 
                        </div>
                        <div className="col-md-3">
                            <Select options={dimensions} defaultValue={dimensions[0]} />
                        </div>
                    </div>

                    <div className="row" style={{height: "1em"}}></div>

                    <div className="row">
                        <div className="col-md-3">
                            {showTablesStride(0)}
                        </div>

                        <div className="col-md-3">
                            {showTablesStride(1)}
                        </div>

                        <div className="col-md-3">
                            {showTablesStride(2)}
                        </div>

                        <div className="col-md-3">
                            {showTablesStride(3)}
                        </div>
                    </div>
                </div>
            );
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
