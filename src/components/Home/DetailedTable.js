import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import agent from '../../agent';
import Table from '../Table';
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

    constructor(props) {
        super(props);

        this.startDate = this.props.startDate;
        this.endDate = this.props.endDate;
    }

    fetchData() {
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

    componentDidMount() {
        this.fetchData()
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    componentDidUpdate() {
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;

        if (this.startDate !== startDate || this.endDate !== endDate) {
            this.startDate = startDate;
            this.endDate = endDate;

            this.fetchData();
        }
    }

    render () {
        const props = this.props;
        const startDate = props.startDate;
        const endDate = props.endDate;
        const table = props.table && props.table[0];

        if (!table) {
            return (
                <div>Loading Table...</div>
            );
        } else if (this.startDate != startDate || this.endDate != endDate) {
            return (
                <div>(Re)Loading Table...</div>
            );
        } else {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-4">
                            <Link to="/">&larr;</Link>&nbsp;All dimensions
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailedTable);
