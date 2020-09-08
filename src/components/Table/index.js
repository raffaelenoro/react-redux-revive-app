import React from 'react';
import { useTable } from 'react-table';

const ShowTable = (props) => {
    const table = props.table;

    const columns = [{
        Header: table.c1_name,
        accessor: 'c1'
    }, {
        Header: table.c2_name,
        accessor: 'c2'
    }];

    const data = table.data.map(
        datum => ({ c1: datum.c1_data, c2: datum.c2_data})
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data});

    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                    </tr>
                )
                })}
            </tbody>
        </table>
    );
}

class Table extends React.Component {
    render() {
        const table = this.props.table;

        return (
            <ShowTable table={table}/>
        );
    }
};

export { Table };