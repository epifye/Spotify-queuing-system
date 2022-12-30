import React, { useState, Component } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SessionJoinPage() {
  const navigate = useNavigate();
  const [sessionPassword, setSessionPassword] = useState("");
  const [error, setError] = useState("");

  const handleTextFieldChange = () => {
    setSessionPassword(event.target.value);
  };

  const handleJoinSessionButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: sessionPassword,
      }),
    };
    fetch("/api/join-session", requestOptions)
      .then((response) => {
        if (response.ok) {
          navigate("/session/" + sessionPassword);
        } else {
          setError("Room Not Found");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Session
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          type="string"
          error={error}
          label="Password"
          placeholder="Enter a Session Code"
          value={sessionPassword}
          helperText={error}
          variant="outlined"
          onChange={handleTextFieldChange}
          inputProps={{ style: { textAlign: "center" } }}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="success"
          onClick={handleJoinSessionButtonPressed}
        >
          Enter Session
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
