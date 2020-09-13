import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from '../Table';
import agent from '../../agent';
import Select from 'react-select';
import {
  TABLES_VIEW_LOADED,
  TABLES_VIEW_UNLOADED,
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.tableList,
  startDate: state.common.startDate,
  endDate: state.common.endDate
});

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, pager, payload) =>
    dispatch({ type: TABLES_VIEW_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({ type: TABLES_VIEW_UNLOADED })
});

class Tables extends React.Component {

    componentDidMount() {
        const tab = "";
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;

        this.props.onLoad(
            tab,
            agent.Tables.all,
            Promise.all([
                agent.Tables.all(startDate, endDate)
            ])
        );
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        const props = this.props;
        const dimensions = [{label: "Billed", value: "billed"}];
        const tables = props.tables;
        const showTablesStride = pos => (
            tables.filter(
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

        if (tables) {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-6"></div>
                        <div className="col-md-3 align-middle">
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
        } else {
            return (
                <div>Loading Tables...</div>
            );
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
