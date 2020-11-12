import React from 'react';

import { Link, Redirect } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Snackbar from '../components/SnackBar';
class ResetPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: "",
      passwordLabel: "Password",
      passwordError: false,
      passwordHelperText: "",
      passwordValid: false,


      confirmPassword: "",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordError: false,
      confirmPasswordHelperText: "",
      confirmPasswordValid: false,

      loginButtonDisabled: true,
      openSnackbar: false,
      verified: false,
      redirect: false,
      message: ""
    }
  }
  componentDidMount = () => {
    fetch(`http://localhost:3000/users/verifyResetToken`, {
      method: "POST",
      redirect: 'follow',
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ token: this.props.match.params.id })
    }).then(res => res.json())
      .then(res => {
        console.log("1", res)
        if (res.data === "verified") {
          this.setState({ verified: true })
        } else {
          this.setState({ verified: false })
        }

      })
  }
  handleSubmit = () => {
    console.log({ email: this.state.email, password: this.state.password, token: this.props.match.params.id })
    fetch("http://localhost:3000/users/resetpassword", {
      method: "POST",
      redirect: 'follow',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: this.state.email, password: this.state.password, token: this.props.match.params.id }),
    }).then(res => res.json()).then(res => {
      console.log(res)
      if (res.data) {

        this.setState({ message: res.data, openSnackbar: true })
        setTimeout(() => {
          this.setState({ redirect: true })
        }, 3000)
      } else {
        this.setState({ message: res.error, openSnackbar: true })
      }
    })
  }
  handleCloseSnackBar = () => {
    this.setState({ openSnackbar: false })
  }
  password = (e) => {
    let pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
    let isNotValid = false;
    if (!pattern.test(e.target.value)) {
      isNotValid = true;
    }
    if (isNotValid) {
      this.setState({
        password: e.target.value,
        passwordError: true,
        passwordLabel: "Please enter correct password",
        passwordHelperText: "Incorrect Password",
        passwordValid: false,
        loginButtonDisabled: true
      })
    } else {
      this.setState({
        password: e.target.value,
        passwordError: false,
        passwordHelperText: "",
        passwordLabel: "",
        passwordValid: true,
      })
      if (this.state.confirmPasswordValid) this.setState({ loginButtonDisabled: false })
    }
    if (this.state.confirmPassword.length > 0) {
      if (this.state.confirmPassword === e.target.value) {
        this.setState({
          // confirmPassword: e.target.value,
          confirmPasswordError: false,
          confirmPasswordLabel: "",
          confirmPasswordHelperText: "",
          confirmPasswordValid: true
        })
        if (this.state.confirmPassword) this.setState({ loginButtonDisabled: false })
      } else {
        this.setState({
          // confirmPassword: e.target.value,
          confirmPasswordError: true,
          confirmPasswordLabel: "Password do not match",
          confirmPasswordHelperText: "Incorrect Password",
          confirmPasswordValid: false,
          loginButtonDisabled: true
        })
      }
    }
  }
  confirmPasswordError = (e) => {
    if (this.state.password === e.target.value) {
      this.setState({
        confirmPassword: e.target.value,
        confirmPasswordError: false,
        confirmPasswordLabel: "",
        confirmPasswordHelperText: "",
        confirmPasswordValid: true
      })
      if (this.state.passwordValid) this.setState({ loginButtonDisabled: false })
    } else {
      this.setState({
        confirmPassword: e.target.value,
        confirmPasswordError: true,
        confirmPasswordLabel: "Password do not match",
        confirmPasswordHelperText: "Incorrect Password",
        confirmPasswordValid: false,
        loginButtonDisabled: true
      })
    }
  }

  render() {
    console.log(this.props.match.params.id)
    return (
      <Container component="main" style={{ paddingTop: '25vh' }} maxWidth="xs" >
        {
          (this.state.redirect) ?
            <Redirect to="/" /> : <></>
        }
        <CssBaseline />
        {
          (this.state.verified) ?
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
                Reset Password
        </Typography>
              <form styles={{
                width: '100%', // Fix IE 11 issue.
              }} noValidate>
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
                />
                <TextField
                  error={this.state.confirmPasswordError}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  onChange={e => this.confirmPasswordError(e)}
                  label={this.state.confirmPasswordLabel}
                  type="password"
                  helperText={this.state.passwordHelperText}
                  id="password"
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
              </form>
            </div> :
            <div>
              <Typography variant="h4" color="textSecondary" align="center">
                Oops! The Link is Expired. Please Generate a new Link from
              <Link to="/forgotpassword" style={{ textDecoration: "none" }}> Reset Password</Link>
              </Typography>
            </div>
        }
      </Container>
    )
  }
}
export default ResetPassword;