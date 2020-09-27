import Filters from './Filters';
import MainView from './MainView';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import {
  HOME_PAGE_UNLOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onUnload: () =>
    dispatch({ type: HOME_PAGE_UNLOADED })
});

class Home extends React.Component {

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page">

        <div className="container page">

          <Switch>
              <Route exact path="/" component={Filters} />
              <Route path="/detailed" component={Filters} />
          </Switch>

          <hr style={{height: "2px", width: "100%"}}/>

          <Switch>
              <Route exact path="/" component={MainView} />
              <Route path="/detailed" component={MainView} />
          </Switch>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
