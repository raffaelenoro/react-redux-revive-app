import React from 'react';
import { connect } from 'react-redux';
import { useTable } from 'react-table';
import {
  ADD_FILTER,
  CHANGE_FILTER,
  REMOVE_FILTER,
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.filterList
});

const mapDispatchToProps = dispatch => ({
    onAdd: (name, value) => dispatch({ type: ADD_FILTER, payload: {name: name, value: value} }),
    onChange: (index, name, value) => dispatch({ type: CHANGE_FILTER, index: index, payload: {name: name, value: value} }),
    onRemove: (index) => dispatch({ type: REMOVE_FILTER, payload: {index: index} })
});

const ShowTable = (props) => {
    const table = props.table;
    const filters = props.filters;
    const onAdd = props.onAdd;
    const onChange = props.onChange;
    const onRemove = props.onRemove;
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
        const filterIndex = filters.findIndex(filter => filter.name === name );
        const filter = filterIndex < 0 ? {} : filters[filterIndex];
        const filterValue = filter.value || "";
        const filtered = (filter.value + "").split(";")
        const valueIndex = filtered.findIndex(v => v === (value + ""));

        if (filterIndex < 0) {
            // no filter by this name 
            onAdd(name, value);
        } else if (valueIndex < 0) {
            // no value in this named filter, add
            onChange(filterIndex, name, filtered.join(";") + ";" + value)
        } else if (filtered.length > 1) {
            // value present, remove
            filtered.splice(valueIndex, 1);
            onChange(filterIndex, name, filtered.join(";"))
        } else {
            // last value, remove filter by this name
            onRemove(filterIndex)
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
        const onAdd = this.props.onAdd;
        const onChange = this.props.onChange;
        const onRemove = this.props.onRemove;

        return (
            <ShowTable table={table} filters={filters} onAdd={onAdd} onChange={onChange} onRemove={onRemove}/>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);