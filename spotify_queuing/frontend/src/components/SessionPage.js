import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomePage from "./HomePage";

export default function Session() {
  const navigate = useNavigate();

  const [votesToSkip, setVotesToSkip] = useState(5);
  const [CanPause, setCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const { password } = useParams();

  fetch("/spotify/get-session?password=" + password)
    .then((response) => {
      if (!response.ok) {
        navigate("/");
      }
      return response.json();
    })
    .then((data) => {
      setVotesToSkip(data.votes_to_skip);
      setCanPause(data.can_pause);
      setIsHost(data.is_host);
    });

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      header: { "Content-Type": "application/json" },
    };
    fetch("/spotify/leave-session", requestOptions).then((_response) =>
      navigate("/")
    );
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Password: {password}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes: {votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Can Pause: {String(CanPause)}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Host: {String(isHost)}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          color="secondary"
          variant="contained"
          onClick={leaveButtonPressed}
        >
          {" "}
          Leave session
        </Button>
      </Grid>
    </Grid>
  );
}

{
  /* <div>
<h3>{password}</h3>
<p>Votes: {votesToSkip}</p>
<p>Can Pause: {String(CanPause)}</p>
<p>Host: {String(isHost)}</p>
</div> */
}
