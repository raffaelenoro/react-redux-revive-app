import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from '../Table';
import Select from 'react-select';

const mapStateToProps = state => ({
  ...state.tableList
});

const Tables = props => {
    const dimensions = [{label: "Billed", value: "billed"}];
    const tables = props.tables;
    const showTablesStride = pos => (
        tables.filter(
            (table, index) => (index % 4) === pos
        ).map(
            table => (
                <React.Fragment key={"table_area_" + table.index}>
                    <Table table={table} />
                    <Link to="/detailed">...</Link>
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
};

export default connect(mapStateToProps)(Tables);
