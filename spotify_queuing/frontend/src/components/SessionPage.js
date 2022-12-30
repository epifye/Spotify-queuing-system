import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateSessionPage from "./CreateSessionPage";
import MusicPlayer from "./MusicPlayer";

export default function Session(props) {
  const navigate = useNavigate();

  const [votesToSkip, setVotesToSkip] = useState(5);
  const [CanPause, setCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  const { password } = useParams();

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

  getSessionDetails();

  useEffect(() => {
    console.log(`initializing interval`);
    const interval = setInterval(() => {
      getCurrentSong();
    }, 1000);
    console.log(`clearing interval`);
    return () => clearInterval(interval);
  });

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
      <MusicPlayer {...song} />
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

// export default class Session extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       votesToSkip: 2,
//       CanPause: false,
//       isHost: false,
//       showSettings: false,
//       spotifyAuthenticated: false,
//       song: {},
//     };
//     let password = this.props.params;
//     this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
//     this.updateShowSettings = this.updateShowSettings.bind(this);
//     this.renderSettingsButton = this.renderSettingsButton.bind(this);
//     this.renderSettings = this.renderSettings.bind(this);
//     this.getSessionDetails = this.getSessionDetails.bind(this);
//     this.authenticateSpotify = this.authenticateSpotify.bind(this);
//     this.getCurrentSong = this.getCurrentSong.bind(this);
//     this.getSessionDetails();
//     this.navigate = useNavigate();
//   }
//   static password = useParams();
//   componentDidMount() {
//     this.interval = setInterval(this.getCurrentSong, 1000);
//   }

//   componentWillUnmount() {
//     clearInterval(this.interval);
//   }

//   getSessionDetails() {
//     return fetch("/api/get-session?password=" + this.password)
//       .then((response) => {
//         if (!response.ok) {
//           this.props.history.push("/");
//           //this.navigate("/");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         this.setState({
//           votesToSkip: data.votes_to_skip,
//           CanPause: data.can_pause,
//           isHost: data.is_host,
//         });
//         if (this.state.isHost) {
//           this.authenticateSpotify();
//         }
//       });
//   }

//   authenticateSpotify() {
//     fetch("/spotify/is-authenticated")
//       .then((response) => response.json())
//       .then((data) => {
//         this.setState({ spotifyAuthenticated: data.status });
//         console.log(data.status);
//         if (!data.status) {
//           fetch("/spotify/get-auth-url")
//             .then((response) => response.json())
//             .then((data) => {
//               window.location.replace(data.url);
//             });
//         }
//       });
//   }

//   getCurrentSong() {
//     fetch("/spotify/current-song")
//       .then((response) => {
//         if (!response.ok) {
//           return {};
//         } else {
//           return response.json();
//         }
//       })
//       .then((data) => {
//         this.setState({ song: data });
//         console.log(data);
//       });
//   }

//   leaveButtonPressed() {
//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//     };
//     fetch("/api/leave-session", requestOptions).then((_response) => {
//       this.props.history.push("/");
//       //this.navigate("/");
//     });
//   }

//   updateShowSettings(value) {
//     this.setState({
//       showSettings: value,
//     });
//   }

//   renderSettings() {
//     return (
//       <Grid container spacing={1}>
//         <Grid item xs={12} align="center">
//           <CreateSessionPage
//             update={true}
//             votesToSkip={this.state.votesToSkip}
//             CanPause={this.state.CanPause}
//             password={this.password}
//             updateCallback={this.getSessionDetails}
//           />
//         </Grid>
//         <Grid item xs={12} align="center">
//           <Button
//             variant="contained"
//             color="warning"
//             onClick={() => this.updateShowSettings(false)}
//           >
//             Close
//           </Button>
//         </Grid>
//       </Grid>
//     );
//   }

//   renderSettingsButton() {
//     return (
//       <Grid item xs={12} align="center">
//         <Button
//           variant="contained"
//           color="warning"
//           onClick={() => this.updateShowSettings(true)}
//         >
//           Settings
//         </Button>
//       </Grid>
//     );
//   }

//   render() {
//     if (this.state.showSettings) {
//       return this.renderSettings();
//     }
//     return (
//       <Grid container spacing={1}>
//         <Grid item xs={12} align="center">
//           <Typography variant="h4" component="h4">
//             Password: {this.password}
//           </Typography>
//         </Grid>
//         {this.state.song}
//         {this.state.isHost ? this.renderSettingsButton() : null}
//         <Grid item xs={12} align="center">
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={this.leaveButtonPressed}
//           >
//             Leave Room
//           </Button>
//         </Grid>
//       </Grid>
//     );
//   }
// }

// // <MusicPlayer {...this.state.song} />
