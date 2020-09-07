import React from 'react';
import { connect } from 'react-redux';


const mapStateToProps = state => ({
  ...state.tableList
});

const Tables = props => {
    const tables = props.tables;

    if (tables) {
        return(
            <div>Tables: {props.tablesCount}</div>
        );
    } else {
        return (
            <div>Loading Tables...</div>
        );
    }
};

export default connect(mapStateToProps)(Tables);
