import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { IonContent } from "@ionic/react";
import { useHistory } from "react-router";
import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";

const Register = () => {
  const history = useHistory();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFname = (e) => {
    setFname(e.target.value);
  };

  const handleLname = (e) => {
    setLname(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleRegister = (event) => {
    event.preventDefault();
    if (!fname) {
      setErrorMessage("Please enter your First Name");
      setLoginError(true);
      return;
    }
    if (!email) {
      setErrorMessage("Please enter your Email address");
      setLoginError(true);
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your Password ");
      setLoginError(true);
      return;
    }

    var postData = {
      firstName: fname,
      lastName: lname,
      email: email,
      password: password,
    };

    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .post("/user/register", JSON.stringify(postData), axiosConfig)
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setAuthToken(response.data.token);
          history.replace("/home");
        } else {
          setErrorMessage("Email already exists. Please login");
          setLoginError(true);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.respose.data.errors[0].msg) {
          setErrorMessage(error.respose.data.errors[0].msg);
          setLoginError(true);
        } else {
          setErrorMessage("Can't connect to server. Please try again");
          setLoginError(true);
        }
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setLoginError(false);
  };

  return (
    <IonContent>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleRegister}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleFname}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={handleLname}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handlePassword}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Snackbar
          open={loginError}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
    </IonContent>
  );
};

export default Register;
