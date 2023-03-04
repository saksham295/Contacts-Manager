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
import { useHistory } from "react-router";
import { Alert, Snackbar } from "@mui/material";
import { IonContent } from "@ionic/react";
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import config from "../../config.json";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
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
      email: email,
      password: password,
    };

    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .post(
        `${config.SERVER_URL}/user/login`,
        JSON.stringify(postData),
        axiosConfig
      )
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setAuthToken(response.data.token);
          history.replace("/home");
        } else {
          setErrorMessage("Email or Password Incorrect");
          setLoginError(true);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.respose.data.errors[0].msg) {
          setErrorMessage(error.respose.data.errors[0].msg);
          setLoginError(true);
        } else if (error.response.data.msg) {
          setErrorMessage("Email or Password Incorrect");
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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleEmail}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handlePassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
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

export default Login;
