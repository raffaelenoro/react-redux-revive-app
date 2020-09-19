import Filters from './Filters';
import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import agent from '../../agent';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  onLoad: (tab, pager, payload) =>
    dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({ type: HOME_PAGE_UNLOADED })
});

class Home extends React.Component {
  componentDidMount() {
    const tab = this.props.token ? 'feed' : 'all';
    const articlesPromise = this.props.token ?
      agent.Articles.feed :
      agent.Articles.all;

//    this.props.onLoad(tab, articlesPromise, Promise.all([agent.Tags.getAll(), articlesPromise()]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page">

        <div className="container page">

          <Filters />

          <hr style={{height: "2px", width: "100%"}}/>

          <Switch>
              <Route exact path="/" component={MainView} />
              <Route path="/detailed" component={MainView} />
          </Switch>
{/*
          <div className="row">
            <div className="col-md-3">
              <div className="sidebar">

                <p>Popular Tags</p>

                <Tags
                  tags={this.props.tags}
                  onClickTag={this.props.onClickTag} />

              </div>
            </div>
          </div>
*/}
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
