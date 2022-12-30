import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateSessionPage from "./CreateSessionPage";

export default function Session(props) {
  const navigate = useNavigate();

  const [votesToSkip, setVotesToSkip] = useState(5);
  const [CanPause, setCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  const { password } = useParams();
  // const interval = useState("");

  const getSessionDetails = () => {
    fetch("/api/get-session?password=" + password)
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
        if (isHost) {
          authenticateSpotify();
        }
      });
  };

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setSong(data);
        console.log(song);
      });
  };

  // const componentDidMount = () => {

  // };

  // const componentWillUnmount = () => {
  //   clearInterval(this.interval);
  // };
  //Calls
  getSessionDetails();
  //getCurrentSong();
  setInterval(getCurrentSong, 1000);

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      header: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-session", requestOptions).then((_response) =>
      navigate("/")
    );
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="warning"
          variant="contained"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateSessionPage
            update={true}
            votesToSkip={votesToSkip}
            CanPause={CanPause}
            password={password}
            updateCallback={getSessionDetails}
          ></CreateSessionPage>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="warning"
            variant="contained"
            onClick={() => setShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  if (showSettings) {
    return renderSettings();
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Password: {password}
        </Typography>
      </Grid>
      {(song["tests"] = "test")}
      {isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          color="secondary"
          variant="contained"
          onClick={leaveButtonPressed}
        >
          Leave session
        </Button>
      </Grid>
    </Grid>
  );
}

{
  /* <Grid item xs={12} align="center">
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
      </Grid> */
}
