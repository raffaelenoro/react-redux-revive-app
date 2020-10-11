import Charts from './Charts';
import Tables from './Tables';
import DetailedTable from './DetailedTable';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { CHANGE_TAB } from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.articleList,
  tags: state.home.tags,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) => dispatch({ type: CHANGE_TAB, tab, pager, payload })
});

const MainView = props => {

    const width = window.innerWidth;
    const breakpoint = 1200;
    const columns = width > breakpoint? 4: 3;

    return (
        <div className="row">
            <div className="col-md-5">
                <Charts />
            </div>

            <div className="col-md-7">
                <Switch>
                    <Route exact path="/" render={(props) => <Tables {...props} columns={columns} />} />
                    <Route path="/detailed/:index" component={DetailedTable} />
                </Switch>
            </div>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
