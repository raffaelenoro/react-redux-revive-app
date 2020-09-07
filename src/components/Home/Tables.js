import React from 'react';
import { connect } from 'react-redux';


const mapStateToProps = state => ({
  ...state.tableList
});

const Tables = props => {
    const tables = props.tables;

    if (tables) {
        return (
            <div>
                <div className="row">
                    <div className="col-md-3">
                        {
                            tables.filter(
                                (table, index) => (index % 4) == 0
                            ).map(table => {
                                return (
                                    <div key={"table_area_" + table.index}>
                                        {table.c1_name}
                                    </div>
                                );
                            })
                        }
                    </div>

                    <div className="col-md-3">
                        {
                            tables.filter(
                                (table, index) => (index % 4) == 1
                            ).map(table => {
                                return (
                                    <div key={"table_area_" + table.index}>
                                        {table.c1_name}
                                    </div>
                                );
                            })
                        }
                    </div>

                    <div className="col-md-3">
                        {
                            tables.filter(
                                (table, index) => (index % 4) == 2
                            ).map(table => {
                                return (
                                    <div key={"table_area_" + table.index}>
                                        {table.c1_name}
                                    </div>
                                );
                            })
                        }
                    </div>

                    <div className="col-md-3">
                        {
                            tables.filter(
                                (table, index) => (index % 4) == 3
                            ).map(table => {
                                return (
                                    <div key={"table_area_" + table.index}>
                                        {table.c1_name}
                                    </div>
                                );
                            })
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
