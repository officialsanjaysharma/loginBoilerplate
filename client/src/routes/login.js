import React from 'react';

import { Link } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SnackBar from '../components/SnackBar';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      redirect: false,
      emailLabel: "Email Address",
      emailError: false,
      emailValid: false,
      emailHelperText: "",
      passwordLabel: "Password",
      passwordError: false,
      passwordHelperText: "",
      passwordValid: false,
      loginButtonDisabled: true,
      openSnackbar: false,
      loginMessage: ""
    }
  }
  login = () => {
    fetch(`http://localhost:3000/users/login`, {
      method: "POST",
      redirect: 'follow',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: this.state.email, password: this.state.password }),
    }).then(res => res.json()).then(res => {
      console.log(res)
      if (res.error) this.setState({ openSnackbar: true, loginMessage: res.error })
      else {
        this.setState({ redirect: true })
        document.location.href = "/";
      }
    }).catch(err => {
      this.setState({ loginMessage: err.Error, openSnackbar: true })
    })
  }
  email = (e) => {
    let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    let isNotValid = false
    if (!pattern.test(e.target.value)) {
      isNotValid = true;
    }
    if (isNotValid) {
      this.setState({
        emailError: true, emailLabel: "Please enter correct email", emailHelperText: "Incorrect Email", emailValid: false, loginButtonDisabled: true
      })
    } else {
      this.setState({ email: e.target.value, emailError: false, emailHelperText: "", emailLabel: "", emailValid: true })
      if (this.state.passwordValid) this.setState({ loginButtonDisabled: false })
    }
  }

  password = (e) => {
    let pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
    let isNotValid = false;
    if (!pattern.test(e.target.value)) {
      isNotValid = true;
    }
    if (isNotValid) {
      this.setState({ passwordError: true, passwordLabel: "Please enter correct password", passwordHelperText: "Incorrect Password", passwordValid: false, loginButtonDisabled: true })
    } else {
      this.setState({ password: e.target.value, passwordError: false, passwordHelperText: "", passwordLabel: "", passwordValid: true, })
      if (this.state.emailValid) this.setState({ loginButtonDisabled: false })
    }
  }
  handleCloseSnackBar = () => {
    this.setState({ openSnackbar: false })
  }
  render() {
    return (
      <Container component="main" style={{ paddingTop: '25vh' }} maxWidth="xs">
        <CssBaseline />
        {

          (this.state.openSnackbar) ?
            <SnackBar message={this.state.loginMessage} handleCloseSnackBar={this.handleCloseSnackBar.bind(this)} /> : <div></div>
        }
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Avatar style={{ padding: 20, background: "blue" }} >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
        </Typography>
          <form styles={{
            width: '100%', // Fix IE 11 issue.
          }} noValidate>
            <TextField
              error={this.state.emailError}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              onChange={e => this.email(e)}
              id="email"
              label={this.state.emailLabel}
              name="email"
              helperText={this.state.emailHelperText}
              autoComplete="email"
              autoFocus
            />
            <TextField
              error={this.state.passwordError}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              onChange={e => this.password(e)}
              label={this.state.passwordLabel}
              type="password"
              helperText={this.state.passwordHelperText}
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              onClick={() => this.login()}
              disabled={this.state.loginButtonDisabled}
              variant="contained"
              color="primary"
            >
              Sign In
          </Button>
            <Grid style={{ paddingTop: 10 }} container>
              <Grid item xs>
                <Link style={{ textDecoration: "none", color: "blue" }} to="/forgotpassword" variant="body2">
                  Forgot password?
              </Link>
              </Grid>
              <Grid item>
                <Link style={{ textDecoration: "none", color: "blue" }} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" style={{ textDecoration: "none", color: "blue" }} href="https://material-ui.com/">
              Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container >
    )
  }
}
export default Login;