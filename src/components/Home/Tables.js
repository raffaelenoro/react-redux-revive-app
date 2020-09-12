import React from 'react';
import { connect } from 'react-redux';
import { Table } from '../Table';
import Select from 'react-select';

const mapStateToProps = state => ({
  ...state.tableList
});

const Tables = props => {
    const dimensions = [{label: "Billed", value: "billed"}];
    const tables = props.tables;

    if (tables) {
        return (
            <div>
                <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-3">
                        <span className="align-middle">Dimension By: </span>
                    </div>
                    <div className="col-md-3">
                        <Select options={dimensions} /> 
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3">
                        {
                            tables.filter(
                                (table, index) => (index % 4) === 0
                            ).map(
                                table => <Table key={"table_area_" + table.index} table={table} />
                            )
                        }
                    </div>

                    <div className="col-md-3">
                        {
                            tables.filter(
                                (table, index) => (index % 4) === 1
                            ).map(
                                table => <Table key={"table_area_" + table.index} table={table} />
                            )
                        }
                    </div>

                    <div className="col-md-3">
                        {
                            tables.filter(
                                (table, index) => (index % 4) === 2
                            ).map(
                                table => <Table key={"table_area_" + table.index} table={table} />
                            )
                        }
                    </div>

                    <div className="col-md-3">
                        {
                            tables.filter(
                                (table, index) => (index % 4) === 3
                            ).map(
                                table => <Table key={"table_area_" + table.index} table={table} />
                            )
                        }
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
