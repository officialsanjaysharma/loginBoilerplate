import React from 'react';

import { Link } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Snackbar from '../components/SnackBar';
class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      emailLabel: "Email Address",
      emailError: false,
      emailValid: false,
      emailHelperText: "",
      loginButtonDisabled: true,
      openSnackbar: false,
      message: ""
    }
  }
  handleSubmit = () => {
    console.log(this.state.email)
    fetch("http://localhost:3000/users/forgotpassword", {
      method: "POST",
      redirect: 'follow',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: this.state.email }),
    }).then(res => res.json()).then(res => {
      if (res.data)
        this.setState({ message: res.data, openSnackbar: true })
      if (res.error)
        this.setState({ message: res.error, openSnackbar: true })
    })
  }
  handleCloseSnackBar = () => {
    this.setState({ openSnackbar: false })
  }
  handleEmail = (e) => {
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
      this.setState({ email: e.target.value, emailError: false, emailHelperText: "", emailLabel: "", emailValid: true, loginButtonDisabled: false })
    }
  }

  render() {
    return (
      <Container component="main" style={{ paddingTop: '25vh' }} maxWidth="xs" >
        <CssBaseline />
        <div style={{
          marginTop: "5vh",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {

            (this.state.openSnackbar) ?
              <Snackbar message={this.state.message} handleCloseSnackBar={this.handleCloseSnackBar.bind(this)} /> : <div></div>
          }
          <Avatar style={{ padding: 20, background: "blue" }} >
            <LockOutlinedIcon />
          </Avatar>
          <Typography style={{ marginTop: 20 }} component="h1" variant="h5">
            Forgot Password
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
              onChange={e => this.handleEmail(e)}
              id="email"
              label={this.state.emailLabel}
              name="email"
              helperText={this.state.emailHelperText}
              autoComplete="email"
              autoFocus
            />
            <Button
              fullWidth
              disabled={this.state.loginButtonDisabled}
              variant="contained"
              color="primary"
              onClick={e => this.handleSubmit()}
              style={{ marginTop: 20 }}
            >
              Submit
          </Button>
            <Grid style={{ paddingTop: 10 }} container>
              <Grid item xs>
                <Link style={{ textDecoration: "none", color: "blue" }} to="/login" variant="body2">
                  Sign in
              </Link>
              </Grid>
              <Grid item>
                <Link style={{ textDecoration: "none", color: "blue" }} to="/signup" variant="body2">
                  {"Sign Up"}
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
    )
  }
}
export default ForgotPassword;