import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CartIcon from '@material-ui/icons/AddShoppingCartOutlined';
import { Link } from 'react-router-dom';

export default class ButtonAppBar extends React.Component {
  logout = () => {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    document.location.href = "/login";
  }
  componentWillReceiveProps() {
    console.log("Props received appbar")
  }
  render() {
    return (
      <div style={{ flexGrow: 1 }} >
        <AppBar position="static" color={"secondary"}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                Pratilipi
            </Link>
            </Typography>
            {
              this.props.authenticated ? <div>

                <IconButton color="inherit">
                  <Link style={{ color: "white", textDecoration: "none" }} to="/cart"><CartIcon /></Link>
                </IconButton>
                <Button onClick={() => this.logout()} color="inherit">Logout</Button>
              </div> : <div></div>
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}