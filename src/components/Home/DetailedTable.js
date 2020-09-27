import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import Table from '../Table';
import {
  DETAILED_TABLE_VIEW_LOADED,
  DETAILED_TABLE_VIEW_UNLOADED,
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
    ...state.detailedTable,
    startDate: state.common.startDate,
    endDate: state.common.endDate,
    filters: state.filterList.filters
});

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, pager, payload) =>
    dispatch({ type: DETAILED_TABLE_VIEW_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({ type: DETAILED_TABLE_VIEW_UNLOADED })
});

class DetailedTable extends React.Component {

    constructor(props) {
        super(props);

        this.startDate = this.props.startDate;
        this.endDate = this.props.endDate;
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

        this.props.onLoad(
            tab,
            pager,
            Promise.all([
                pager(startDate, endDate, index, filters)
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

        if (this.startDate !== startDate || this.endDate !== endDate || this.filters !== filters) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.filters = filters;

            this.fetchData();
        }
    }

    render () {
        const props = this.props;
        const startDate = props.startDate;
        const endDate = props.endDate;
        const filters = props.filters;
        const table = props.table && props.table[0];

        if (!table) {
            return (
                <div>Loading Table...</div>
            );
        } else if (this.startDate !== startDate || this.endDate !== endDate || this.filters !== filters) {
            return (
                <div>(Re)Loading Table...</div>
            );
        } else {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            <Table table={table} maxRows={100} checkMark={true} />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailedTable);
