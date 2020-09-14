import React from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import {
  ADD_FILTER,
  CHANGE_FILTER,
  REMOVE_FILTER,
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.filterList,
  startDate: state.common.startDate,
  endDate: state.common.endDate
});

const mapDispatchToProps = dispatch => ({
  onClick: (payload) => dispatch({ type: ADD_FILTER, payload: payload }),
  onChange: (index, payload) => dispatch({ type: CHANGE_FILTER, index: index, payload: payload})
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

    const onClick = e => {
        e.preventDefault();
        e.target.blur();
        props.onClick({name: "", value: ""});
    }
    const onNameChange = (index, e) => {
        const filter = props.filters[index];
        props.onChange(index, {name: e.target.value, value: filter.value});
    };
    const onValueChange = (index, e) => {
        const filter = props.filters[index];
        props.onChange(index, {name: filter.name, value: e.target.value});
    };

    return (
      <React.Fragment>
        <div className="row">
            <div className="col-md-12">
                <p className="col-md-4" style={{backgroundColor: "#eeeeee", border: "lightgray 2px solid"}}>
                    <span> { dateSpan + " Days" } </span>
                    <br />
                    <span> { startDate + " - " + endDate } </span>
                </p>
            </div>
        </div>

        <div className="row">
            <div className="col-md-12">
                <div>
                    <span>Filters: </span>
                    {props.filters.map((filter, index) =>
                        <span key={"filter_" + index} className="input-group">
                            <input className="form-control form-control-sm" value={filter.name} onChange={onNameChange.bind(null, index)} />
                            <input className="form-control form-control-sm" value={filter.value} onChange={onValueChange.bind(null, index)} />
                        </span>
                    )}
                    <Button size="sm" onClick={onClick}>+</Button>
                </div>
            </div>
        </div>
      </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
