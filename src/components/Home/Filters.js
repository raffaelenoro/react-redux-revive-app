import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { Route, Switch, Link } from 'react-router-dom';
import {
  CHANGE_FILTER,
  REMOVE_FILTER,
  START_DATE,
  END_DATE,
  SET_SELECTED_DIMENSION
} from '../../constants/actionTypes';

import "react-datepicker/dist/react-datepicker.css";

const mapStateToProps = state => ({
  ...state.filterList,
  startDate: state.common.startDate,
  endDate: state.common.endDate,
  dimensions: state.common.dimensions,
  selectedDimension: state.common.selectedDimension
});

const mapDispatchToProps = dispatch => ({
  onClick: (type, payload) => dispatch({ type: type, payload: payload }),
  onChange: (index, payload) => dispatch({ type: CHANGE_FILTER, index: index, payload: payload}),
  onDate: (type, payload) => dispatch({ type: type, payload: payload}),
  onDimension: dimension => dispatch({ type: SET_SELECTED_DIMENSION, dimension })
});

class Filters extends React.Component {

    constructor(props) {
        super(props);

        this.dimensions = this.props.dimensions;
        this.selectedDimension = this.props.selectedDimension;
    }

    setDimension(dimension) {
        this.selectedDimension = dimension;

        this.props.onDimension(dimension);
    }

    componentDidUpdate() {
        const dimensions = this.props.dimensions;

        if (this.dimensions !== dimensions) {
            this.dimensions = dimensions;
        }

        if (!this.selectedDimension) {
            const value = dimensions[0];

            this.setDimension(value);
        }
    }

    render() {
    
        const props = this.props;

        const startDate = props.startDate;
        const endDate = props.endDate;
        const dateSpan = Math.round((endDate - startDate) / (24 * 3600 * 1000)) + 1;

        const dimensions = props.dimensions;
        const selectedDimension = props.selectedDimension;

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
        const onChange = dimension => {
            return this.setDimension(dimension.value);
        }
        const DateButton = React.forwardRef(({value, onClick}, ref) => (
            <button style={{border: "none", paddingLeft: 0, paddingRight: 0}} onClick={onClick}>{value}</button>
        ));

        const Selector = () => (
            <div className="col-md-3">
                Dimension by: 
                <Select
                    options={dimensions.map(dimension => ({label: dimension, value: dimension}))}
                    defaultValue={{label: selectedDimension, value: selectedDimension}}
                    onChange={onChange} />
            </div>
        );

        const NoSelector = () => (
            <div className="col-md-3">
                <Link to="/">&larr; All dimensions</Link>
            </div>
        );

        if (this.dimensions.length === 0) {
            return (
                <div>
                    Loading Filters...
                </div>
            );
        }
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-auto" style={{backgroundColor: "#eeeeee", border: "lightgray 2px solid"}}>
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

                    <div className="col-md-5"></div>

                    <Switch>
                        <Route exact path="/" component={Selector} />
                        <Route path="/detailed" component={NoSelector} />
                    </Switch>
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
