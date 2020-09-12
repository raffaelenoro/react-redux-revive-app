import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import {
  DETAILED_TABLE_VIEW_LOADED,
  DETAILED_TABLE_VIEW_UNLOADED,
} from '../../constants/actionTypes';

const mapStateToProps = state => {
    return {
        ...state.tableList,
//        startDate: state.common.startDate,
//        endDate: state.common.endDate
    }
};

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, pager, payload) =>
    dispatch({ type: DETAILED_TABLE_VIEW_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({ type: DETAILED_TABLE_VIEW_UNLOADED })
});

class DetailedTable extends React.Component {
    componentDidMount() {
        return;
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

    render () {
        const location = this.props.location;
        const index = location.state.index;

        return (
            <div> Detailed Table here ... </div>
        );
    }
}

export default connect(mapStateToProps, mapStateToProps)(DetailedTable);
