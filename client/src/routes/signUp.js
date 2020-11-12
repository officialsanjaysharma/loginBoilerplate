import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SnackBar from '../components/SnackBar'

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      firstNameError: "",
      firstNameHelperText: "",
      firstNameValid: false,

      lastName: "",
      lastNameError: "",
      lastNameHelperText: "",
      lastNameValid: false,

      email: "",
      emailError: "",
      emailHelperText: "",
      emailValid: false,

      password: "",
      passwordError: "",
      passwordHelperText: "",
      passwordValid: false,

      loginButtonDisabled: true,
      openSnackbar: false,
      loginMessage: ""
    }
  }
  handleSubmit = () => {
    console.log("hey")
    fetch(`http://localhost:3000/users`, {
      method: "POST",
      redirect: 'follow',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, password: this.state.password }),
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
  handleFirstName = (e) => {
    let pattern = new RegExp(/[a-z]{1,10}/i);
    let isNotValid = false
    if (!pattern.test(e.target.value)) {
      isNotValid = true;
    }
    if (isNotValid) {
      this.setState({
        firstNameError: true, firstNameLabel: "Please enter correct firstName", firstNameHelperText: "Incorrect firstName", firstNameValid: false, loginButtonDisabled: true
      })
    } else {
      this.setState({ firstName: e.target.value, firstNameError: false, firstNameHelperText: "", firstNameLabel: "", firstNameValid: true })
      if (this.state.passwordValid && this.state.emailValid && this.state.lastNameValid) this.setState({ loginButtonDisabled: false })
    }
  }
  handleLastName = (e) => {
    let pattern = new RegExp(/[a-z]{1,10}/i);
    let isNotValid = false
    if (!pattern.test(e.target.value)) {
      isNotValid = true;
    }
    if (isNotValid) {
      this.setState({
        lastNameError: true, lastNameLabel: "Please enter correct lastName", lastNameHelperText: "Incorrect lastName", lastNameValid: false, loginButtonDisabled: true
      })
    } else {
      this.setState({ lastName: e.target.value, lastNameError: false, lastNameHelperText: "", lastNameLabel: "", lastNameValid: true })
      if (this.state.passwordValid && this.state.emailValid && this.state.firstNameValid) this.setState({ loginButtonDisabled: false })
    }
  }
  handleEmail = (e) => {
    console.log("-->", e.target.value)
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
      console.log(e.target.value)
      this.setState({ email: e.target.value, emailError: false, emailHelperText: "", emailLabel: "", emailValid: true })
      if (this.state.passwordValid && this.state.emailValid && this.state.firstNameValid) this.setState({ loginButtonDisabled: false })
    }
  }
  handlePassword = (e) => {
    let pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
    let isNotValid = false
    if (!pattern.test(e.target.value)) {
      isNotValid = true;
    }
    if (isNotValid) {
      this.setState({
        passwordError: true, passwordLabel: "Please enter correct password", passwordHelperText: "Incorrect password", passwordValid: false, loginButtonDisabled: true
      })
    } else {
      this.setState({ password: e.target.value, passwordError: false, passwordHelperText: "", passwordLabel: "", passwordValid: true })
      if (this.state.emailValid && this.state.emailValid && this.state.firstNameValid) this.setState({ loginButtonDisabled: false })
    }
  }
  handleCloseSnackBar = () => {
    this.setState({ openSnackbar: false })
  }
  render() {
    return (
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        {

          (this.state.openSnackbar) ?
            <SnackBar message={this.state.loginMessage} handleCloseSnackBar={this.handleCloseSnackBar.bind(this)} /> : <div></div>
        }
        <div style={{
          marginTop: "5vh",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Avatar style={{
            margin: 20,
            backgroundColor: "blue",
          }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
        </Typography>
          <form style={{
            width: '100%', // Fix IE 11 issue.
            marginTop: 20
          }} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={this.state.firstNameError}
                  autoComplete="fname"
                  helperText={this.state.firstNameHelperText}
                  onChange={(e) => this.handleFirstName(e)}
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={this.state.lastNameError}
                  helperText={this.state.lastNameHelperText}
                  onChange={(e) => this.handleLastName(e)}
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={this.state.emailError}
                  helperText={this.state.emailHelperText}
                  onChange={(e) => this.handleEmail(e)}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={this.state.passwordError}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={(e) => this.handlePassword(e)}
                  helperText={this.state.passwordHelperText}
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              disabled={this.state.loginButtonDisabled}
              variant="contained"
              color="primary"
              onClick={() => this.handleSubmit()}
              style={{ marginTop: 20 }}
            >
              Sign Up
          </Button>
            <Grid style={{ marginTop: 20 }} container justify="flex-end">
              <Grid item>
                <Link style={{ textDecoration: "none", color: "blue" }} to="/login" variant="body2">
                  Already have an account? Sign in
              </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link style={{ textDecoration: "none", color: "blue" }} color="inherit" href="https://material-ui.com/">
              Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    );
  }
}

export default SignUp;