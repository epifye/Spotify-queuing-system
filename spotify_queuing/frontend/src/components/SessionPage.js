import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function Session() {
  const [votesToSkip, setVotesToSkip] = useState(5);
  const [CanPause, setCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const { password } = useParams();

  fetch("/spotify/get-session?password=" + password)
    .then((response) => response.json())
    .then((data) => {
      setVotesToSkip(data.votes_to_skip);
      setCanPause(data.can_pause);
      setIsHost(data.is_host);
    });

  return (
    <div>
      <h3>{password}</h3>
      <p>Votes: {votesToSkip}</p>
      <p>Can Pause: {String(CanPause)}</p>
      <p>Host: {String(isHost)}</p>
    </div>
  );
}
