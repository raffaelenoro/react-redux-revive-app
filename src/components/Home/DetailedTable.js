import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import agent from '../../agent';
import { Table } from '../Table';
import {
  DETAILED_TABLE_VIEW_LOADED,
  DETAILED_TABLE_VIEW_UNLOADED,
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
    ...state.detailedTable,
    startDate: state.common.startDate,
    endDate: state.common.endDate
});

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, pager, payload) =>
    dispatch({ type: DETAILED_TABLE_VIEW_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({ type: DETAILED_TABLE_VIEW_UNLOADED })
});

class DetailedTable extends React.Component {
    componentDidMount() {
        const tab = "";
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const location = this.props.location;
        const index = location.state.index;

        this.props.onLoad(
            tab,
            agent.DetailedTable.all,
            Promise.all([
                agent.DetailedTable.all(startDate, endDate, index)
            ])
        );
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render () {
        const props = this.props;
        const table = props.table && props.table[0];

        if (table) {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-1">
                            <Link to="/">&larr;</Link>
                        </div>
                        <div className="col-md-3">
                            All dimensions
                        </div>
                    </div>

                    <div className="row" style={{height: "1em"}}></div>

                    <div className="row">
                        <div className="col-md-12">
                            <Table table={table} maxRows={100} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>Loading Table...</div>
            );
        }

        return (
            <div> Detailed Table here ... </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailedTable);