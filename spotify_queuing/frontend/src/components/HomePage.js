import React, { useState } from "react";
import SessionJoinPage from "./SessionJoinPage";
import CreateSessionPage from "./CreateSessionPage";
import SessionPage from "./SessionPage";
import { Button, Grid, Typography, ButtonGroup } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

export default function HomePage() {
  const [sessionPassword, setSessionPassword] = useState(null);

  const RenderHomePage = () => {
    fetch("/api/user-in-session")
      .then((response) => response.json())
      .then((data) => {
        setSessionPassword(data.password);
      });
    if (sessionPassword) {
      return <Navigate to={`/session/${sessionPassword}`} replace={true} />;
    } else {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} align="center">
            <Typography variant="h3" component="h3">
              Queuing spotify
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button color="primary" to="/join" component={Link}>
                Join a Session
              </Button>
              <Button color="secondary" to="/create" component={Link}>
                Create a Session
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      );
    }
  };

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<RenderHomePage />} />
        <Route exact path="/join" element={<SessionJoinPage />} />
        <Route exact path="/create" element={<CreateSessionPage />} />
        <Route exact path="/session/:password" element={<SessionPage />} />
      </Routes>
    </Router>
  );
}
