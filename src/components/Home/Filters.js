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

    let dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(startDate);
    let mm = new Intl.DateTimeFormat('en', { month: 'short' }).format(startDate);
    let yy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(startDate);
    startDate = mm + ". " + dd + ", " + yy;

    dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(endDate);
    mm = new Intl.DateTimeFormat('en', { month: 'short' }).format(endDate);
    yy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(endDate);
    endDate = mm + ". " + dd + ", " + yy;

    return (
      <div className="col-md-12">
          <p className="col-md-4" style={{backgroundColor: "#eeeeee", border: "lightgray 2px solid"}}>
            <span> { dateSpan + " Days" } </span>
            <br />
            <span> { startDate + " - " + endDate } </span>
          </p>

          <div>
            <span>Filters:</span>
          </div>
      </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
