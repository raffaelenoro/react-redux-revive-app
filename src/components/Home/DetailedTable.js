import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import Table from '../Table';
import {
  DETAILED_TABLE_VIEW_LOADED,
  DETAILED_TABLE_VIEW_UNLOADED,
  SET_SELECTED_DIMENSION
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
    ...state.detailedTable,
    startDate: state.common.startDate,
    endDate: state.common.endDate,
    selectedDimension: state.common.selectedDimension,
    filters: state.filterList.filters,
});

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, pager, sorting, payload) =>
    dispatch({ type: DETAILED_TABLE_VIEW_LOADED, tab, pager, sorting, payload }),
  onUnload: () =>
    dispatch({ type: DETAILED_TABLE_VIEW_UNLOADED }),
  onSort: dimension =>
    dispatch({ type: SET_SELECTED_DIMENSION, dimension })
});

class DetailedTable extends React.Component {

    constructor(props) {
        super(props);

        this.startDate = this.props.startDate;
        this.endDate = this.props.endDate;
        this.selectedDimension = this.props.selectedDimension;
        this.filters = this.props.filters;
    }

    fetchData() {
        const tab = "";
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const filters = this.props.filters;
        const location = this.props.location;
        const index = location.state.index;
        const pager = filters.length > 0 ? agent.DetailedTable.filtered : agent.DetailedTable.all;
        const dimension = this.props.selectedDimension.index;
        const sorting = this.props.selectedDimension.sorting;

        this.props.onLoad(
            tab,
            pager,
            sorting,
            Promise.all([
                pager(
                    startDate,
                    endDate,
                    index,
                    dimension + 2,
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
        this.props.onUnload();
    }

    componentDidUpdate() {
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const filters = this.props.filters;
        const selectedDimension = this.props.selectedDimension;

        if (this.startDate !== startDate || this.endDate !== endDate || this.filters !== filters || this.selectedDimension !== selectedDimension) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.filters = filters;
            this.selectedDimension = selectedDimension;

            this.fetchData();
        }
    }

    render () {
        const props = this.props;
        const startDate = props.startDate;
        const endDate = props.endDate;
        const selectedDimension = props.selectedDimension;
        const sorting = selectedDimension.sorting;
        const filters = props.filters;
        const table = props.table && props.table[0];

        const onSort = sorting =>
            this.props.onSort({ ...selectedDimension, sorting: sorting });

        if (!table) {
            return (
                <div>Loading Table...</div>
            );
        } else if (this.startDate !== startDate || this.endDate !== endDate || this.filters !== filters || this.selectedDimension !== selectedDimension) {
            return (
                <div>(Re)Loading Table...</div>
            );
        } else {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            <Table
                                table={table}
                                maxRows={100}
                                checkMark={true}
                                sortableColumn={1 + selectedDimension.index}
                                sorting={sorting}
                                onSort={onSort} />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailedTable);
