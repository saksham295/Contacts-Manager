import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { IonContent } from "@ionic/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const Home = () => {
  const history = useHistory();
  const [user, setUser] = useState();
  const [contacts, setContacts] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();
  const [dialogOpen, setDialogOpen] = useState();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    axios
      .get("/user/getUser")
      .then((response) => {
        console.log("🚀 ~ file: home.jsx:14 ~ response:", response);
        if (response.status === 200) {
          setUser(response.data);
          let userContacts = response.data.contacts;
          userContacts.forEach((contact) => (contact.isEditing = false));
          setContacts(userContacts);
        } else {
          history.replace("/login");
        }
      })
      .catch((error) => {
        console.log(error);
        history.replace("/login");
      });
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleIsEditing = (contact, i) => {
    setName(contact.contactName);
    setPhone(contact.contactPhone);
    setEmail(contact.contactEmail);
    setAddress(contact.contactAddress);
    let newContacts = contacts.filter((eachContact) => eachContact !== contact);
    contact.isEditing = true;
    newContacts.splice(i, 0, contact);
    setContacts(newContacts);
  };

  const handleCancelEditing = (contact, i) => {
    let newContacts = contacts.filter((eachContact) => eachContact !== contact);
    contact.isEditing = false;
    newContacts.splice(i, 0, contact);
    setContacts(newContacts);
  };

  const handleEdit = (contact, i) => {
    let postData = {
      id: contact._id,
      newName: name,
      newPhone: phone,
      newEmail: email,
      newAddress: address,
    };

    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post("/user/editContact", JSON.stringify(postData), axiosConfig)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          let newContacts = contacts.filter(
            (eachContact) => eachContact !== contact
          );
          contact = response.data;
          contact.isEditing = false;
          newContacts.splice(i, 0, contact);
          setContacts(newContacts);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (contactPhone) => {
    let postData = {
      contactPhone: contactPhone,
    };

    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post("/user/deleteContact", JSON.stringify(postData), axiosConfig)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setContacts(
            contacts.filter((contact) => contact.contactPhone !== contactPhone)
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAlertClose = () => {
    setError(false);
  };

  const handleAdd = () => {
    let postData = {
      contactName: name,
      contactPhone: phone,
      contactEmail: email,
      contactAddress: address,
    };
    console.log("🚀 ~ file: home.jsx:95 ~ handleEdit ~ postData:", postData);

    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post("/user/addContact", JSON.stringify(postData), axiosConfig)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setDialogOpen(false);
          getUser();
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.errors) {
          setDialogOpen(false);
          setError(true);
          setErrorMessage(err.response.data.errors[0].msg);
        } else if (err.response.data.message) {
          setDialogOpen(false);
          setError(true);
          setErrorMessage(err.response.data.message);
        } else {
          setDialogOpen(false);
          setError(true);
          setErrorMessage("Can't connect to server. Please try again");
        }
      });
  };

  return (
    <IonContent>
      <Container maxWidth="xl" sx={{ mb: 5 }}>
        {user !== undefined && contacts !== undefined ? (
          <Stack
            sx={{ p: 2, flexWrap: "wrap" }}
            direction="row"
            justifyContent={{ xs: "center", sm: "flex-start" }}
            alignItems="center"
          >
            {contacts.map((contact, i) => (
              <Card sx={{ width: 300, m: 2, background: "whitesmoke" }} key={i}>
                <CardContent>
                  {contact.isEditing ? (
                    <TextField
                      label="Enter New Name"
                      size="small"
                      defaultValue={contact.contactName}
                      sx={{ mb: 2 }}
                      onChange={handleNameChange}
                    />
                  ) : (
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {contact.contactName}
                    </Typography>
                  )}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <PhoneIcon fontSize="small" />
                    {contact.isEditing ? (
                      <TextField
                        label="Enter New Phone Number"
                        size="small"
                        defaultValue={contact.contactPhone}
                        onChange={handlePhoneChange}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {contact.contactPhone}
                      </Typography>
                    )}
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ margin: contact.isEditing ? "15px 0px" : "5px 0px" }}
                    justifyContent="flex-start"
                  >
                    <EmailIcon fontSize="small" />
                    {contact.isEditing ? (
                      <TextField
                        label="Enter New Email ID"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        defaultValue={contact.contactEmail}
                        onChange={handleEmailChange}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {contact.contactEmail !== null &&
                        contact.contactEmail !== ""
                          ? contact.contactEmail
                          : "No Email"}
                      </Typography>
                    )}
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <HomeIcon fontSize="small" />
                    {contact.isEditing ? (
                      <TextField
                        label="Enter New Address"
                        multiline
                        size="small"
                        defaultValue={contact.contactAddress}
                        maxRows={4}
                        onChange={handleAddressChange}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {contact.contactAddress !== null &&
                        contact.contactAddress !== ""
                          ? contact.contactAddress
                          : "No Address"}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  {contact.isEditing ? (
                    <>
                      <IconButton onClick={() => handleEdit(contact, i)}>
                        <DoneIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleCancelEditing(contact, i)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleIsEditing(contact, i)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(contact.contactPhone)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </CardActions>
              </Card>
            ))}
          </Stack>
        ) : (
          <></>
        )}
      </Container>
      <Fab
        variant="extended"
        size="medium"
        color="primary"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add Contact
      </Fab>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Contact</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter Name"
            sx={{ mb: 2, mt: 2 }}
            fullWidth
            required
            onChange={handleNameChange}
          />
          <TextField
            label="Enter Phone Number"
            sx={{ mb: 2 }}
            fullWidth
            required
            onChange={handlePhoneChange}
          />
          <TextField
            label="Enter Email ID"
            sx={{ mb: 2 }}
            fullWidth
            onChange={handleEmailChange}
          />
          <TextField
            label="Enter Address"
            sx={{ mb: 2 }}
            fullWidth
            onChange={handleAddressChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdd}>Add</Button>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={error}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </IonContent>
  );
};

export default Home;
