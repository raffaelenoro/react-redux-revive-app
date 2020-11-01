import Filters from './Filters';
import MainView from './MainView';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import {
  HOME_PAGE_UNLOADED
} from '../../constants/actionTypes';
import $ from "jquery";

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

  componentDidMount() {
    $(document).on('mouseenter', '.ellipsis th', function() {
        if (this.offsetWidth < this.scrollWidth && !$(this).attr('title')) {
            $(this).attr('title', $(this).text());
        }
    });
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page">

        <div className="container page container-30px">

          <Switch>
              <Route exact path="/" component={Filters} />
              <Route path="/detailed/:index" component={Filters} />
          </Switch>

          <hr style={{height: "2px", width: "100%"}}/>

          <Switch>
              <Route exact path="/" component={MainView} />
              <Route path="/detailed/:index" component={MainView} />
          </Switch>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
