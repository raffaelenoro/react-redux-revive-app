import React from 'react';
import { connect } from 'react-redux';
import { Loading } from './Home/Loading';
import {
  LOGOUT
} from '../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
  onLoad: () => dispatch({ type: LOGOUT })
});

class Logout extends React.Component {

    componentDidMount() {
        this.props.onLoad();
    }

    render() {
        return (
            <Loading height={40} width={40} altText="Signing out..." />
        );
    }
}

export default connect(null, mapDispatchToProps)(Logout);
