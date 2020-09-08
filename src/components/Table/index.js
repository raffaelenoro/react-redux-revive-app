import React from 'react';
import { useTable } from 'react-table';

class Table extends React.Component {
    render() {
        const table = this.props.table;

        return (
            <div>
                {table.c1_name}
            </div>
        );
    }
};

export { Table };