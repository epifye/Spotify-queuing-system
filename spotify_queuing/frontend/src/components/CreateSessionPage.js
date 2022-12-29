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
  Collapse,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CreateSessionPage(props) {
  const defaultProps = {
    votesToSkip: props.votesToSkip ? props.votesToSkip : 5,
    CanPause: true,
    update: false,
    password: null,
    updateCallback: () => {},
  };
  const navigate = useNavigate();

  const [CanPause, setCanPause] = useState(
    props.CanPause ? props.CanPause : false
  );
  const [votesToSkip, setVotesToSkip] = useState(defaultProps.votesToSkip);
  const [update, setUpdate] = useState(defaultProps.update);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleVotesChange = () => {
    setVotesToSkip(event.target.value);
  };

  const handleCanPauseChange = () => {
    // setCanPause(event.target.value);
    console.log("TEST 1 " + CanPause);
    setCanPause(event.target.value === "true" ? true : false);
    console.log(CanPause);
  };

  const handleSessionButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        can_pause: CanPause,
      }),
    };
    fetch("/spotify/create-session", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/session/" + data.password));
  };

  const handleUpdateButtonPressed = () => {
    console.log(CanPause);
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        can_pause: CanPause,
        password: props.password,
      }),
    };
    fetch("/spotify/update-session", requestOptions).then((response) => {
      if (response.ok) {
        setSuccessMsg("Session updated successfully!");
      } else {
        setErrorMsg("Error updating session.");
      }
      props.updateCallback();
    });
  };

  const title = props.update ? "Update Session" : "Create a Session";

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="success"
            variant="contained"
            onClick={handleSessionButtonPressed}
          >
            Create A Session
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="success"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Session
        </Button>
      </Grid>
    );
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg != "" || successMsg != ""}>
          {successMsg != "" ? (
            <Alert
              severity="success"
              onClose={() => {
                setSuccessMsg("");
              }}
            >
              {successMsg}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMsg("");
              }}
            >
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset" defaultValue={CanPause}>
          <FormHelperText component="div">
            <div align="center">Guest Control of PlayBackState</div>
          </FormHelperText>
          <RadioGroup row value={CanPause} onChange={handleCanPauseChange}>
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
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            defaultValue={votesToSkip}
            inputProps={{ min: 1, style: { textAlign: "center" } }}
          />
          <FormHelperText component="div">
            <div align="center">Votes Required to Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {props.update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
}
