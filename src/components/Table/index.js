import React from 'react';
import { connect } from 'react-redux';
import { useTable } from 'react-table';

const mapStateToProps = state => ({
  ...state.filterList
});

const ShowTable = (props) => {
    const table = props.table;
    const filters = props.filters;
    const maxRows = props.maxRows;
    let i = 0;
    const columns = [];
    while (table.hasOwnProperty("c" + (++i) + "_name") === true) {
        columns.push({
            Header: table["c" + i + "_name"],
            accessor: "c" + i + "_data"
        })
    };

    const length = Math.min(12, table.data.length);
    const data = table.data.slice(0, length);
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
        style: {fontSize: "13px", marginBottom: 0}
    };

    const onClick = (name, value, e) => {
        console.log(name, value);
        const filter = filters.find( ({ n }) => n === name );

        if (filter) {

        } else {

        }
    }

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
                    <tr {...row.getRowProps()} onClick={onClick.bind(null, table.name, row.cells[0].value)}>
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
        const filters = this.props.filters;

        return (
            <ShowTable table={table} filters={filters}/>
        );
    }
};

export default connect(mapStateToProps)(Table);