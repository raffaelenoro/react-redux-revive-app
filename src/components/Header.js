import React from 'react';
import { Link } from 'react-router-dom';

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item">
          <Link to="/login" className="nav-link btn btn-success revive-link-btn">
              Sign in
          </Link>
        </li>

        <li className="nav-item disabled-link">
          <Link to="/register" className="nav-link">
            Sign up
          </Link>
        </li>

      </ul>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item">
          <Link to="/" className="nav-link disabled-link" style={{pointerEvents: "none"}}>
              Signed in as: <b> {props.currentUser.username} </b>
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/logout" className="nav-link">
            Sign out
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/settings" className="nav-link">
            <i className="ion-gear-a"></i>&nbsp;Settings
          </Link>
        </li>

      </ul>
    );
  }

  return null;
};

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light">
        <div className="container container-30px">

          <Link to="/" className="navbar-brand" style={{width:"200px"}}>
              <img className="img-responsive" src="/revive_logo.png" alt="logo" style={{width: "100%", height: "100%", objectFit: "contain"}}/>
          </Link>

          <LoggedOutView currentUser={this.props.currentUser} />

          <LoggedInView currentUser={this.props.currentUser} />
        </div>
      </nav>
    );
  }
}

export default Header;
