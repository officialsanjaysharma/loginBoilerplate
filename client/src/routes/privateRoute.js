import React from "react";
import PropTypes from 'prop-types';
import { instanceOf } from 'prop-types';
import { Route, Redirect } from "react-router-dom";
import { withCookies, Cookies } from 'react-cookie';
import { CircularProgress } from '@material-ui/core';
import AppBar from "../components/AppBar";
class PrivateRoute extends React.Component {
  static propTypes = { cookies: instanceOf(Cookies).isRequired };

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = { authenticated: false, jwt: cookies.get("jwt") }
  }
  async componentWillMount() {
    if (this.state.jwt) {
      console.log('hey', this.state.jwt)
      await fetch("http://localhost:3000/users/verify", {
        method: "GET",
        redirect: 'follow',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.jwt}`,
        }
      })
        .then(res => res.json())
        .then(res => {
          console.log("respones", res)
          if (res.data === "authorised") this.setState({ authenticated: true })
        })
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    const { authenticated } = this.state;
    return (

      (this.state.authenticated) ?
        <div>
          <AppBar authenticated={this.state.authenticated} ></AppBar>
          <Route
            {...rest}
            render={({ props }) => (authenticated ? <Component {...props} /> : <Redirect to={{ pathname: "/login", state: { data: props.location } }} />)
            } />
        </div> :
        <div>
          {
            this.state.jwt ? <div><CircularProgress /></div> : <Redirect to="/login" />
          }
        </div>
    )
  }
}


PrivateRoute.propTypes = {
  component: PropTypes.any,
}

export default withCookies(PrivateRoute);