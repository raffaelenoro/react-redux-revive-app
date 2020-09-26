import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import {
  CHANGE_FILTER,
  REMOVE_FILTER,
  START_DATE,
  END_DATE
} from '../../constants/actionTypes';

import "react-datepicker/dist/react-datepicker.css";

const mapStateToProps = state => ({
  ...state.filterList,
  startDate: state.common.startDate,
  endDate: state.common.endDate
});

const mapDispatchToProps = dispatch => ({
  onClick: (type, payload) => dispatch({ type: type, payload: payload }),
  onChange: (index, payload) => dispatch({ type: CHANGE_FILTER, index: index, payload: payload}),
  onDate: (type, payload) => dispatch({ type: type, payload: payload})
});

class Filters extends React.Component {

    render() {
    
        const props = this.props;

        const startDate = props.startDate;
        const endDate = props.endDate;
        const dateSpan = Math.round((endDate - startDate) / (24 * 3600 * 1000)) + 1;

        const onRemove = (index, e) => {
            e.preventDefault();
            props.onClick(REMOVE_FILTER, {index: index})
        }
        const onDateChange = (type, date) => {
            props.onDate(type, {
                startDate: (type === START_DATE ? date : startDate),
                endDate: (type === END_DATE ? date : endDate)
            });
        }
        const DateButton = React.forwardRef(({value, onClick}, ref) => (
            <button style={{border: "none", paddingLeft: 0, paddingRight: 0}} onClick={onClick}>{value}</button>
        ));

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-6" style={{backgroundColor: "#eeeeee", border: "lightgray 2px solid"}}>
                        <DatePicker 
                            name="startDate"
                            selected={startDate}
                            onChange={onDateChange.bind(null, START_DATE)}
                            maxDate={new Date()}
                            customInput={<DateButton />}
                            dateFormat="MMM dd, yyyy" />
                        <span> - </span>
                        <DatePicker 
                            name="endDate"
                            selected={endDate}
                            onChange={onDateChange.bind(null, END_DATE)}
                            maxDate={new Date()}
                            customInput={<DateButton />}
                            dateFormat="MMM dd, yyyy" />
                        <span> {"(" + dateSpan + " Days)"} </span>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-1">
                        <span>Filters: </span>
                    </div>
                    <div className="col-md-11">
                        <ul className="list-inline d-flex align-items-center" style={{display:"flex", marginBottom: 0}}>
                            {props.filters.map((filter, index) =>
                                <li className="list-inline-items" style={{paddingRight: "8px"}} key={"filter_" + index}>
                                    <span>{filter.name}</span>
                                    <span>{": " + filter.value.join("; ")}</span>
                                    <button type="button" className="close" aria-label="Close" onClick={onRemove.bind(null, index)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
