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
    if (!this.props.token) {
        return(
            <div className="landingArea">

                <div className="content">
                    <div className="grid">
                        <div className="row">
                            <div className="col x4 l6 m7 s8 r16 ox3 ol1">
                                <h1>
                                    <span>We're</span>
                                    <span>Revolutionizing</span>
                                    <span>Revenue Cycle</span>
                                </h1>
                                <p>Revive is a revenue cycle management 
    platform for the modern digital age. With Revive powering your hospital 
    or physician group, you can quickly optimize your claims collection 
    process, increase revenue and decrease costs to collect.
    </p>
                            
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    } else {
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
