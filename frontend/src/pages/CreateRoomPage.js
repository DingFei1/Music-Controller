import React, { Component } from "react";
import { Button, Grid, Typography, TextField, FormControl, FormHelperText,
  Radio, RadioGroup, FormControlLabel, Collapse, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import { withRouter } from "./withRouter";


class CreateRoomPage extends Component {
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: this.props.guestCanPause,
      votesToSkip: this.props.votesToSkip,
      successMsg: "",
      errorMsg: ""
    };

    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
  }

  handleGuestCanPauseChange(e) {
    this.setState({
      guestCanPause:e.target.value === "true" ? true: false
    })
  }

  handleVotesChange(e) {
    this.setState({
      votesToSkip: e.target.value
    });
  }

  handleRoomButtonPressed() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause
      })
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) =>
        this.props.navigate("/room/" + data.code)
      )
      .catch((error) => console.error("Error:", error));
  }

  handleUpdateButtonPressed() {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
        code: this.props.roomCode
      })
    };
    fetch("/api/update-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          this.setState({
              successMsg: "Room updated successfully!"
          })
        } else {
          this.setState({
              errorMsg: "Error updating room..."
          })
        }
        this.props.updateCallback();
      }
    );
  }

  renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" onClick={this.handleRoomButtonPressed}>
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
  }

  renderUpdateButtons() {
    return (
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" onClick={this.handleUpdateButtonPressed}>
          Update Room
        </Button>
      </Grid>
    );
  }

  render() {
    const title = this.props.update ? "Update Room" : "Create A Room";

    return (
      <Grid container spacing = {1}>
        <Grid item xs={12} align="center">
          <Collapse in={this.state.errorMsg !== "" || this.state.successMsg !== ""}> // Need review
            {this.state.successMsg !== "" 
            ? (<Alert severity="success" onClose={() => {this.setState({successMsg:""})}}>{this.state.successMsg}</Alert>) 
            : (<Alert severity="error" onClose={() => {this.setState({errorMsg:""})}}>{this.state.errorMsg}</Alert>)}
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
            <RadioGroup row defaultValue={this.props.guestCanPause.toString()} 
              onChange={this.handleGuestCanPauseChange}>
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
              defaultValue={this.state.votesToSkip}
              onChange={this.handleVotesChange}
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
        {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
      </Grid>
    );
  }
}

export default withRouter(CreateRoomPage);