import React from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-datepicker';
import {
  ADD_FILTER,
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
  onClick: (payload) => dispatch({ type: ADD_FILTER, payload: payload }),
  onChange: (index, payload) => dispatch({ type: CHANGE_FILTER, index: index, payload: payload}),
  onDate: (type, payload) => dispatch({ type: type, payload: payload})
});

class Filters extends React.Component {

    render() {
    
        const props = this.props;

        const startDate = props.startDate;
        const endDate = props.endDate;
        const dateSpan = (endDate - startDate) / (24 * 3600 * 1000);

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
        const onDateChange = (type, date) => {
            props.onDate(type, {
                startDate: (type === START_DATE ? date : startDate),
                endDate: (type === END_DATE ? date : endDate)
            });
        }

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-6" style={{backgroundColor: "#eeeeee", border: "lightgray 2px solid"}}>
                        <span> { dateSpan + " Days" } </span>
                        <br />
                        <DatePicker 
                            name="startDate"
                            selected={startDate}
                            onChange={onDateChange.bind(null, START_DATE)}
                            dateFormat="MMM dd, yyyy" />
                        <span> - </span>
                        <DatePicker 
                            name="endDate"
                            selected={endDate}
                            onChange={onDateChange.bind(null, END_DATE)}
                            dateFormat="MMM dd, yyyy" />
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
