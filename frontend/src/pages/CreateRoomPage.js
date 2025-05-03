import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormControl, FormHelperText,
  Radio, RadioGroup, FormControlLabel, Collapse, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";


const CreateRoomPage = (
  {
    votesToSkip: initialVotesToSkip = 2,
    guestCanPause: initialGuestCanPause = true,
    update = false, // Attention
    roomCode = null,
    updateCallback = () => {}
  }) => {
  const [guestCanPause, setGuestCanPause] = useState(initialGuestCanPause);
  const [votesToSkip, setVotesToSkip] = useState(initialVotesToSkip);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate(); 

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  }

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause
      })
    };
    fetch("/api/create-room", requestOptions)
    .then((response) => response.json())
    .then((data) => navigate("/room/" + data.code))
    .catch((error) => console.error("Error:", error));
  }

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode
      })
    };
    fetch("/api/update-room", requestOptions)
    .then((response) => {
      if (response.ok) {
        setSuccessMsg("Room updated successfully!");
      } else {
        setErrorMsg("Error updating room...");
      }
      updateCallback();
    });
  }

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" onClick={handleRoomButtonPressed}>
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="primary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" onClick={handleUpdateButtonPressed}>
          Update Room
        </Button>
      </Grid>
    );
  };

  const title = update ? "Update Room" : "Create A Room";

  return (
    <Grid container spacing = {1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg !== "" || successMsg !== ""}> {/* Need review */}
          {successMsg !== "" 
          ? (<Alert severity="success" onClose={() => {setSuccessMsg("")}}>{successMsg}</Alert>) 
          : (<Alert severity="error" onClose={() => {setErrorMsg("")}}>{errorMsg}</Alert>)}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <FormHelperText component="span">
            <div align='center'>
              Guest Control of Playback State
            </div>
          </FormHelperText>
          <RadioGroup row defaultValue={guestCanPause.toString()} 
            onChange={handleGuestCanPauseChange}>
            <FormControlLabel value="true" 
              control={<Radio color="primary"/>}
              label="Play/Pause"
              labelPlacement = "bottom"/>
            <FormControlLabel value="false" 
              control={<Radio color="secondary"/>}
              label="No Control"
              labelPlacement = "bottom"/>
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField required={true} 
            type="number" 
            defaultValue={votesToSkip}
            onChange={handleVotesChange}
            slotProps={{
              input: {
                min: 1,
                style: { textAlign: "center" },
              },
            }}/>
          <FormHelperText component="span">
            <div align="center">
              Votes Required to Skip Song 
            </div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
};

export default CreateRoomPage;