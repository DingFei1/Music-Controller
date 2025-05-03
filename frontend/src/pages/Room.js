import React, { useEffect, useState, useRef } from "react";
import { Grid, Button, Typography } from "@mui/material";
//import { withRouter } from "./withRouter";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

const Room = (props) => {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  const intervalRef = useRef();

  const roomCode = props.params.roomCode;

  useEffect(() => {
    getRoomDetails();
    getCurrentSong();
    intervalRef.current = setInterval(getCurrentSong, 999);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isHost) {
      authenticateSpotify();
    }
  }, [isHost]);

  const getRoomDetails = () => {
    fetch("/api/get-room" + "?code=" + roomCode)
    .then((response) => {
      if (!response.ok) {
          props.leaveRoomCallback();
          props.navigate("/");
      }
      return response.json();
    })
    .then((data) => {
      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);
    })
    .catch((error) => console.error("Error fetching room details:", error));
  };

  const authenticateSpotify = () => {
    fetch('/spotify/is-authenticated')
    .then((response) => response.json())
    .then((data) => {
      setSpotifyAuthenticated(data.status);
      if (!data.status) {
        fetch('/spotify/get-auth-url')
        .then((response) => response.json())
        .then((data) => {
          window.location.replace(data.url);
        });
      };
    });
  };

  const getCurrentSong = () => {
    fetch('/spotify/current-song').then((response) => {
      if (!response.ok) {
        return {};
      }
      else {
        return response.json();
      }
    }).then((data) => setSong(data));
  }

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    }
    fetch("/api/leave-room", requestOptions).then((_response) => {
      props.navigate("/");
    });
  }

  const updateShowSettings = (value) => {
    setShowSettings(value);
  }

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip= {votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}>
          </CreateRoomPage>
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="primary" onClick={() => updateShowSettings(false)}>
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button variant="contained" color="primary" onClick={()=> updateShowSettings(true)}>
          Settings
        </Button>
      </Grid>
    );
  }

  if (showSettings) {
      return renderSettings();
  }
  else {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: { roomCode }
          </Typography>
        </Grid>
        <MusicPlayer {...song}> </MusicPlayer>
        {isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" onClick={ leaveButtonPressed }>
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
};

export default Room;