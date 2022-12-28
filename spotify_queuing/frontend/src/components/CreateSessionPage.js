import React, { useState, Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CreateSessionPage(props) {
  const navigate = useNavigate();

  const [defaultVotes, setDefaultVotes] = useState(5);
  const [CanPause, setCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);

  const handleVotesChange = () => {
    setVotesToSkip(event.target.value);
  };

  const handleCanPauseChange = () => {
    setCanPause(event.target.value === "true" ? true : false);
  };

  const handleSessionButtonPressed = () => {
    console.log("TEST");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        can_pause: CanPause,
      }),
    };
    console.log("TEST2");
    fetch("/spotify/create", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/session/" + data.password));
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          Create A Session
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText component="div">
            <div align="center">Guest Control of PlayBackState</div>
          </FormHelperText>
          <RadioGroup row defaultValue="true" onChange={handleCanPauseChange}>
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="number"
              onChange={handleVotesChange}
              defaultValue={defaultVotes}
              inputProps={{ min: 1, style: { textAlign: "center" } }}
            />
            <FormHelperText component="div">
              <div align="center">Votes Required to Skip Song</div>
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="success"
            variant="contained"
            onClick={handleSessionButtonPressed}
          >
            {" "}
            Create A Session
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            {" "}
            Back
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
