import React from "react";
import App from "../App";
import Login from "./login";
import PrivateRoute from "./privateRoute";
import { withCookies, } from "react-cookie";
import SignUp from "./signUp";
import ResetPassword from "./resetPassword";
import ForgotPassword from "./forgotPassword";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = { verifying: "", jwt: cookies.get("jwt"), authenticated: false }
  }

  componentDidMount() {
    fetch('http://localhost:3000/users/verify', {
      method: "GET",
      redirect: "follow",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.state.jwt}`,
      }
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        if (res.data) this.setState({ authenticated: true })
        else this.setState({ authenticated: false })
      })
  }

  render() {
    console.log(this.state.authenticated)
    return (
      <>
        <BrowserRouter >
          <Switch>
            <Route exact path="/login" component={Login} >
              {this.state.authenticated ? <Redirect to="/" /> : null}
            </Route>
            <Route exact path="/forgotPassword" component={ForgotPassword} >
              {this.state.authenticated ? <Redirect to="/" /> : null}
            </Route>
            <Route exact path="/reset/password/:id" component={ResetPassword} >
              {this.state.authenticated ? <Redirect to="/" /> : null}
            </Route>
            <Route exact path="/signup" component={SignUp} >
              {this.state.authenticated ? <Redirect to="/" /> : null}
            </Route>
            <PrivateRoute exact path="/" component={App} />
            <Redirect to="/" />
          </Switch>
        </BrowserRouter>
      </>
    )
  }
}

export default withCookies(AppRouter);