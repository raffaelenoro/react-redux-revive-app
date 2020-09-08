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

    const tableProps = {
        ...getTableProps(),
        className:"table table-sm",
        style: {fontSize: "13px"}
    };

    return (
        <table {...tableProps}>
            <thead style={{backgroundColor: "#eeeeee"}}>
                {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, index) => {
                        const columnProps = {
                            ...column.getHeaderProps(),
                            style: { textAlign: index > 0 ? "right": "left" }
                        };
                        
                        return <th {...columnProps}>{column.render('Header')}</th>
                    })}
                </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                    {row.cells.map((cell, index) => {
                        const cellProps = {
                            ...cell.getCellProps(),
                            style: { textAlign: index > 0 ? "right": "left" }
                        };

                        return <td {...cellProps}>{cell.render('Cell')}</td>
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