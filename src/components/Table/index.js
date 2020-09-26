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
    onAdd: (index, name, value) => dispatch({ type: ADD_FILTER, payload: {index: index, name: name, value: value} }),
    onChange: (filterIndex, index, name, value) => dispatch({ type: CHANGE_FILTER, index: filterIndex, payload: {index: index, name: name, value: value} }),
    onRemove: (filterIndex) => dispatch({ type: REMOVE_FILTER, payload: {index: filterIndex} })
});

const ShowTable = (props) => {
    const table = props.table;
    const filters = props.filters;
    const onAdd = props.onAdd;
    const onChange = props.onChange;
    const onRemove = props.onRemove;
    const maxRows = props.maxRows;
    const checkMark = props.checkMark;
    let i = 0;
    const columns = [];
    while (table.hasOwnProperty("c" + (++i) + "_name") === true) {
        columns.push({
            Header: table["c" + i + "_name"],
            accessor: "c" + i + "_data"
        })
    };

    const filter = filters.find(filter => filter.index === table.index) || {};
    const filterValue = filter.value || [];

    const length = Math.min(maxRows, table.data.length);
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

    const onClick = (index, name, value, e) => {
        const filterIndex = filters.findIndex(filter => filter.name === name);
        const valueIndex = filterValue.findIndex(v => v === value);

        if (filterIndex < 0) {
            // no filter by this name
            onAdd(index, name, [value]);
        } else if (valueIndex < 0) {
            // no value in this named filter, add
            filterValue.push(value);
            onChange(filterIndex, index, name, filterValue)
        } else if (filterValue.length > 1) {
            // value is present, remove
            filterValue.splice(valueIndex, 1);
            onChange(filterIndex, index, name, filterValue)
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

                    const value = row.cells[0].value;
                    const mark = checkMark && filterValue.find(v => v === value);
                    const rowProps = {
                        ...row.getRowProps(),
                        style: { backgroundColor: mark ? "lightgray": "default" }
                    };
                    
                    return (
                        <tr {...rowProps} onClick={onClick.bind(null, table.index, table.name, value)}>
                            {row.cells.map((cell, index) => {
                                const cellProps = {
                                    ...cell.getCellProps(),
                                    style: { textAlign: index > 0 ? "right": "left" }
                                };
                                const value = cell.render('Cell');

                                if (index === 0 && mark) {
                                    return <td {...cellProps}><span>&#10003;</span><span>{value}</span></td>;
                                } else {
                                    return <td {...cellProps}><span>{value}</span></td>;
                                }

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
        const maxRows = this.props.maxRows;
        const checkMark = this.props.checkMark;
        const filters = this.props.filters;
        const onAdd = this.props.onAdd;
        const onChange = this.props.onChange;
        const onRemove = this.props.onRemove;

        return (
            <ShowTable table={table} maxRows={maxRows} checkMark={checkMark} filters={filters} onAdd={onAdd} onChange={onChange} onRemove={onRemove} />
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);