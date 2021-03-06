import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { Route, Switch, Link } from 'react-router-dom';
import { Loading } from './Loading';
import {
  CHANGE_FILTER,
  REMOVE_FILTER,
  START_DATE,
  END_DATE,
  SET_DIMENSIONS,
  SET_SELECTED_DIMENSION
} from '../../constants/actionTypes';

import "react-datepicker/dist/react-datepicker.css";
import '../../styles.css'; 

const mapStateToProps = state => ({
  ...state.common,
  firstTable: state.tableList.tables && state.tableList.tables[0]
});

const mapDispatchToProps = dispatch => ({
  onClick: (type, payload) => dispatch({ type: type, payload: payload }),
  onChange: (index, payload) => dispatch({ type: CHANGE_FILTER, index: index, payload: payload}),
  onDate: (type, payload) => dispatch({ type: type, payload: payload}),
  onDimensions: dimensions => dispatch({ type: SET_DIMENSIONS, dimensions }),
  onSelectedDimension: dimension => dispatch({ type: SET_SELECTED_DIMENSION, dimension })
});

class Filters extends React.Component {

    constructor(props) {
        super(props);

        this.dimensions = this.props.dimensions;
        this.selectedDimension = this.props.selectedDimension;
    }

    setDimensions(dimensions) {
        this.dimensions = dimensions;

        this.props.onDimensions(this.dimensions);
    }

    setSelectedDimension(dimension, index) {
        this.selectedDimension = { dimension, index };

        this.props.onSelectedDimension(this.selectedDimension);
    }

    componentDidUpdate() {
        const firstTable = this.props.firstTable;

        if (firstTable && this.dimensions.length === 0) {
            const dimensions = [];

            for (var i = 2; ; i++) {
                const name = "c" + i + "_name";
                if (!firstTable.hasOwnProperty(name)) break;
                const value = firstTable[name];

                dimensions.push(value);
            }

            this.setDimensions(dimensions);
        }

        if (!this.selectedDimension && this.dimensions.length > 0) {
            const value = this.dimensions[0];

            this.setSelectedDimension(value, 0);
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
            const index = dimensions.findIndex(d => d === dimension.value);

            return this.setSelectedDimension(dimension.value, index);
        }
        const DateButton = React.forwardRef(({value, onClick}, ref) => (
            <button style={{border: "none", paddingLeft: 0, paddingRight: 0}} onClick={onClick}>{value}</button>
        ));

        const Selector = () => (
            <div className="grid-container-selector" style={{float: "right"}}>
                <div className="grid-child-selector">
                    Dimension by:
                </div>
                <div className="grid-child-selector">
                    <Select
                        options={dimensions.map(dimension => ({label: dimension, value: dimension}))}
                        defaultValue={{label: selectedDimension.dimension, value: selectedDimension.dimension}}
                        onChange={onChange} />
                </div>
            </div>
        );

        const NoSelector = () => (
            <div style={{float: "right", padding: "7px"}}>
                <div>
                    <Link className="revive-link" to="/">
                        <i className="fa fa-long-arrow-left" aria-hidden="true"/>&nbsp;
                        All dimensions
                    </Link>
                </div>
            </div>
        );

        if (dimensions.length === 0 || !selectedDimension) {
            return (
                <Loading height={40} width={40} altText="Loading Filters..." />
            );
        } else {
            return (
                <React.Fragment>
                    <div className="align-self-center" style={{marginLeft: "-15px", marginRight: "-15px"}}>
                        <div className="card" style={{backgroundColor: "#eeeeee", marginBottom: 0, display: "block", float: "left"}}>
                            <div className="card-body" style={{padding: "4px"}}><table><tbody><tr>
                                <td className="revive-date">
                                    <DatePicker 
                                        name="startDate"
                                        selected={startDate}
                                        onChange={onDateChange.bind(null, START_DATE)}
                                        maxDate={new Date()}
                                        customInput={<DateButton />}
                                        dateFormat="MMM dd, yyyy" />
                                </td>
                                <td><span>&nbsp; - &nbsp;</span></td>
                                <td className="revive-date">
                                    <DatePicker 
                                        name="endDate"
                                        selected={endDate}
                                        onChange={onDateChange.bind(null, END_DATE)}
                                        maxDate={new Date()}
                                        customInput={<DateButton />}
                                        dateFormat="MMM dd, yyyy" />
                                </td>
                                <td><span>&nbsp; {"(" + dateSpan + " Days)"}</span></td>
                            </tr></tbody></table></div>
                        </div>

                        <Switch>
                            <Route exact path="/" component={Selector} />
                            <Route path="/detailed" component={NoSelector} />
                        </Switch>
                    </div>

                    <div className="row" style={{clear: "both", paddingTop: "10px"}}>
                        <div className="col-md-auto" style={{padding: "4px"}}>
                            <span>Filters: </span>
                        </div>
                        <div className="col-md-11" style={{paddingTop: "4px"}}>
                                {props.filters.map((filter, index) =>
                                    <span className="tag-default tag-pill" key={"filter_" + index}>
                                        {filter.name + ": " + filter.value.join("; ")}&nbsp;
                                        <i className="fa fa-times" style={{cursor: "pointer"}} onClick={onRemove.bind(null, index)}></i>
                                    </span>
                                )}
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
