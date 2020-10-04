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
  SET_DIMENSIONS,
  SET_SELECTED_DIMENSION
} from '../../constants/actionTypes';
import usePersistedState from '../../persister';

import "react-datepicker/dist/react-datepicker.css";
import '../../styles.css'; 

const mapStateToProps = state => ({
  ...state.filterList,
  startDate: state.common.startDate,
  endDate: state.common.endDate,
  dimensions: state.common.dimensions,
  selectedDimension: state.common.selectedDimension,
  firstTable: state.tableList.tables && state.tableList.tables[0]
});

const mapDispatchToProps = dispatch => ({
  onClick: (type, payload) => dispatch({ type: type, payload: payload }),
  onChange: (index, payload) => dispatch({ type: CHANGE_FILTER, index: index, payload: payload}),
  onDate: (type, payload) => dispatch({ type: type, payload: payload}),
  onDimensions: dimensions => dispatch({ type: SET_DIMENSIONS, dimensions }),
  onSelectedDimension: dimension => dispatch({ type: SET_SELECTED_DIMENSION, dimension })
});

function FiltersView(props) {
    const startDate = props.startDate;
    const endDate = props.endDate;
    const dimensions = props.dimensions;
    const selectedDimension = props.selectedDimension;

    const dateSpan = Math.round((endDate - startDate) / (24 * 3600 * 1000)) + 1;

    const DateButton = React.forwardRef(({value, onClick}, ref) => (
        <button style={{border: "none", paddingLeft: 0, paddingRight: 0}} onClick={onClick}>{value}</button>
    ));

    const onDateChange = (type, date) => {
        props.onDate(type, {
            startDate: (type === START_DATE ? date : startDate),
            endDate: (type === END_DATE ? date : endDate)
        });
    }

    const onRemove = (index, e) => {
        e.preventDefault();
        props.onClick(REMOVE_FILTER, {index: index})
    }

    const onChange = dimension => {
        const index = dimensions.findIndex(d => d === dimension.value);

        return this.setSelectedDimension(dimension.value, index);
    }

    const NoSelector = () => (
        <div className="col-md-2 offset-md-2" style={{margin: "auto"}}>
            <Link className="revive-link" to="/">&larr; All dimensions</Link>
        </div>
    );

    const Selector = () => (
        <React.Fragment>
            <div className="col-md-auto" style={{margin: "auto", marginRight: "8px"}}>
                Dimension by: 
            </div>
            <div className="col-md-3" style={{margin: "auto"}}>
                <Select
                    options={dimensions.map(dimension => ({label: dimension, value: dimension}))}
                    defaultValue={{label: selectedDimension.dimension, value: selectedDimension.dimension}}
                    onChange={onChange} />
            </div>
        </React.Fragment>
    );

    const [dim, setDim] = usePersistedState("dimensions", dimensions);

    if (dimensions.length === 0 || !selectedDimension) {
        return <div>Loading Filters...</div>
    } else {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-auto" style={{backgroundColor: "#eeeeee", border: "lightgray 2px solid", marginTop: "8px", marginBottom: "8px", height: "2em"}}>
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

                    <div className="col-md-4"></div>

                    <Switch>
                        <Route exact path="/" component={Selector} />
                        <Route path="/detailed" component={NoSelector} />
                    </Switch>
                </div>

                <div className="row">
                    <div className="col-md-auto">
                        <span>Filters: </span>
                    </div>
                    <div className="col-md-11">
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
        this.selectedDimension = { dimension, index, sorting: "desc" };

        this.props.onSelectedDimension(this.selectedDimension);
    }

    componentDidUpdate() {
        const firstTable = this.props.firstTable;

        if (this.props.dimensions.length === 0) {
            const dimensions = [];

            for (var i = 2; ; i++) {
                const name = "c" + i + "_name";
                if (!firstTable.hasOwnProperty(name)) break;
                const value = firstTable[name];

                dimensions.push(value);
            }

            this.setDimensions(dimensions);
        }

        if (!this.selectedDimension) {
            const value = this.dimensions[0];

            this.setSelectedDimension(value, 0);
        }
    }

    render() {
    
        const props = this.props;

        return <FiltersView {...props} />
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
