import React from 'react';
import { connect } from 'react-redux';
import { useTable } from 'react-table';
import ReactDOMServer from 'react-dom/server';
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
    const sortableColumn = props.sortableColumn;
    const leftAlignIndex = sortableColumn ? 1 : 0;
    const sorting = props.sorting;
    const onSort = props.onSort;
    const onAdd = props.onAdd;
    const onChange = props.onChange;
    const onRemove = props.onRemove;
    const maxRows = props.maxRows;
    const checkMark = props.checkMark;
    let i = 0;
    const columns = sortableColumn ? [{Header: String.fromCharCode(10003), accessor: "c0_data"}] : [];
    const currency = [];
    while (table.hasOwnProperty("c" + (++i) + "_name") === true) {
        columns.push({
            Header: table["c" + i + "_name"],
            accessor: "c" + i + "_data"
        })
        currency.push(table["c" + i + "_units"] === "currency");
    };

    const filter = filters.find(filter => filter.index === table.index) || {};
    const filterValue = filter.value || [];

    const length = Math.min(maxRows, table.data.length);
    const data = table.data.slice(0, length).map(
        d => ({...d, c0_data: " "})
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
                            style: {
                                textAlign: index > leftAlignIndex ? "right": "left",
                                cursor: index === sortableColumn ? "pointer": "default",
                                color: sortableColumn && index === 0 ? "silver": "default"
                            }
                        };

                        if (!sortableColumn || index !== (sortableColumn + 1)) {
                            return <th {...columnProps}>{column.render('Header')}</th>;
                        } else {
                            return (
                                <th {...columnProps} onClick={onSort.bind(null, "asc")}>
                                    {column.render('Header')}
                                    {String.fromCharCode(sorting === "desc" ? 9650: 9660)}
                                </th>
                            );
                        }
                    })}
                </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {

                    prepareRow(row)

                    const value = row.cells[leftAlignIndex].value;
                    const mark = checkMark && filterValue.find(v => v === value);
                    const rowProps = {
                        ...row.getRowProps(),
                        style: { backgroundColor: mark ? "#f8f8f8": "default" }
                    };

                    return (
                        <tr {...rowProps} onClick={onClick.bind(null, table.index, table.name, value)}>
                            {row.cells.map((cell, index) => {
                                const cellProps = {
                                    ...cell.getCellProps(),
                                    style: { textAlign: index > leftAlignIndex ? "right": "left" }
                                };
                                const value = ReactDOMServer.renderToString(cell.render('Cell'));
                                const format = number =>
                                    currency[index] ? "$" + (+number).toLocaleString() : number;

                                if (mark && index === 0) {
                                    return <td {...cellProps}>&#10003;</td>;
                                } else {
                                    return <td {...cellProps}>{format(value)}</td>;
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
        const sortableColumn = this.props.sortableColumn;
        const sorting = this.props.sorting;
        const onSort = this.props.onSort;
        const onAdd = this.props.onAdd;
        const onChange = this.props.onChange;
        const onRemove = this.props.onRemove;

        return (
            <ShowTable
                table={table}
                maxRows={maxRows}
                checkMark={checkMark}
                sortableColumn={sortableColumn}
                sorting={sorting}
                onSort={onSort}
                filters={filters}
                onAdd={onAdd}
                onChange={onChange}
                onRemove={onRemove} />
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);