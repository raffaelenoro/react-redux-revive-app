import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  startDate: state.common.startDate,
  endDate: state.common.endDate
});

const mapDispatchToProps = dispatch => ({
//  onTabClick: (tab, pager, payload) => dispatch({ type: CHANGE_TAB, tab, pager, payload })
});

const Filters = props => {

    let startDate = props.startDate.split("_");
    let endDate = props.endDate.split("_");

    startDate = new Date(startDate[0], startDate[1] - 1, startDate[2]);
    endDate = new Date(endDate[0], endDate[1] - 1, endDate[2]);    

    let dateSpan = endDate - startDate;

    dateSpan /= (24 * 3600 * 1000);

    return (
      <div className="col-md-12">
          <p> { dateSpan + " Days"} </p>
          <p> { startDate + " - " + endDate } </p>
      </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
