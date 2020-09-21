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

        const onClick = e => {
            e.preventDefault();
            e.target.blur();
            props.onClick(ADD_FILTER, {name: "", value: ""});
        }
        const onRemove = (index, e) => {
            e.preventDefault();
            props.onClick(REMOVE_FILTER, {index: index})
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
        const DateButton = React.forwardRef(({value, onClick}, ref) => (
            <button style={{border: "none", paddingLeft: 0, paddingRight: 0}} onClick={onClick}>{value}</button>
        ));

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-6" style={{backgroundColor: "#eeeeee", border: "lightgray 2px solid", paddingBottom: "1em"}}>
                        <p> { dateSpan + " Days" } </p>
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
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div>
                            <span>Filters: </span>
                            <Button size="sm" onClick={onClick} disabled>+</Button>
                            <ul className="list-unstyled small">
                                {props.filters.map((filter, index) =>
                                    <li key={"filter_" + index}>
                                        <span>{filter.name}</span>: <span>{filter.value} </span>
                                        <button type="button" className="btn btn-sm btn-dark" onClick={onRemove.bind(null, index)}>-</button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
