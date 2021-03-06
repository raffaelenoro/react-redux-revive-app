import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import Table from '../Table';
import { Loading } from './Loading';
import {
  DETAILED_TABLE_VIEW_LOADED,
  DETAILED_TABLE_VIEW_UNLOADED,
  SET_SORTED_DIMENSION
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
    ...state.detailedTable,
    startDate: state.common.startDate,
    endDate: state.common.endDate,
    selectedDimension: state.common.selectedDimension,
    sortedDimension: state.common.sortedDimension,
    filters: state.common.filters,
});

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, pager, sorting, payload) =>
    dispatch({ type: DETAILED_TABLE_VIEW_LOADED, tab, pager, sorting, payload }),
  onUnload: () =>
    dispatch({ type: DETAILED_TABLE_VIEW_UNLOADED }),
  onSort: dimension =>
    dispatch({ type: SET_SORTED_DIMENSION, dimension })
});

class DetailedTable extends React.Component {

    constructor(props) {
        super(props);

        this.startDate = this.props.startDate;
        this.endDate = this.props.endDate;
        this.sortedDimension = this.props.sortedDimension;
        this.filters = this.props.filters;
    }

    fetchData() {
        const tab = "";
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const filters = this.props.filters;
        const index = this.props.match.params.index;
        const pager = filters.length > 0 ? agent.DetailedTable.filtered : agent.DetailedTable.all;
        const sorting = this.props.sortedDimension;

        this.props.onLoad(
            tab,
            pager,
            sorting,
            Promise.all([
                pager(
                    startDate,
                    endDate,
                    index,
                    sorting,
                    filters
                )
            ])
        );
    }

    componentDidMount() {
        this.fetchData()
    }

    componentWillUnmount() {
        this.props.onSort(null);
        this.props.onUnload();
    }

    componentDidUpdate() {
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const filters = this.props.filters;
        const sortedDimension = this.props.sortedDimension;

        if (this.filters !== filters) {
            const index = +this.props.match.params.index;
            const currentFound = !!(this.filters || []).find(filter => filter.index === index);
            const found = !!(filters || []).find(filter => filter.index === index);
            const length = (filters && filters.length) || 0;
            const currentLength = (this.filters && this.filters.length) || 0;
            // if the number of filters is less because we removed a filter for
            // another table, we need to fetch data. If the filter for the current
            // table was the one being removed, we just refresh the view
            const fetch = length < currentLength && currentFound === found;

            this.filters = filters;

            fetch ? this.fetchData() : this.forceUpdate();
        }

        if (this.startDate !== startDate || this.endDate !== endDate || this.sortedDimension !== sortedDimension) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.sortedDimension = sortedDimension;

            this.fetchData();
        }
    }

    render () {
        const props = this.props;
        const startDate = props.startDate;
        const endDate = props.endDate;
        const sortedDimension = props.sortedDimension;
        const filters = props.filters;
        const table = props.table && props.table[0];

        const onSort = (index, sorting) =>
            this.props.onSort({ ...sortedDimension, index: index, sorting: sorting });

        if (!table) {
            return (
                <Loading height={40} width={40} altText="Loading Table..." />
            );
        } else if (this.filters !== filters) {
            return (
                <Loading height={40} width={40} altText="Refreshing Table..." />
            );
        } else if (this.startDate !== startDate || this.endDate !== endDate || this.filters !== filters || this.sortedDimension !== sortedDimension) {
            return (
                <Loading height={40} width={40} altText="(Re)Loading Table..." />
            );
        } else {
            return (
                <div>
                    <div className="grid-container-detail">
                        <div className="grid-child-detail">
                            <Table
                                table={{...table, c1_unit: "integer"}}
                                maxRows={100}
                                checkColumn={true}
                                onSort={onSort} />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailedTable);
