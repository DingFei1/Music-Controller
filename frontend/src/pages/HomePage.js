import React, { useEffect, useState } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import Info from "./Info";
//import { indigo } from "@mui/material/colors";


const HomePage = () => {
  const [roomCode, setRoomCode] = useState(null);
  
  const clearRoomCode = () => {
    setRoomCode(null);
  };
  
  useEffect(() => {
    fetch("http://localhost:8000/api/user-in-room")
    .then((response) => response.json())
    .then((data) => {
      setRoomCode(data.code);
    });
  }, []);
    
  const renderHomePage = () => {
    return (
      <Grid container direction="column" spacing={3} justifyContent="center"
        alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid container direction="column" spacing={3}>
          <Grid item xs={12} align="center">
            <Typography variant="h3" sx={{ mb: 3 }}>
              House Party
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button color="primary" to="/join" component={Link}>
                Join a Room
              </Button>
              <Button color="default" to="/info" component={Link}>
                Info
              </Button>
              <Button color="secondary" to="/create" component={Link}>
                Create a Room
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' 
          element={
            roomCode ? (
                <Navigate to={`/room/${roomCode}`} />
            ) : (
                renderHomePage()
            )
        }/>
        <Route path='/join' element={<RoomJoinPage/>}/>
        <Route path="/info" element={<Info/>} />
        <Route path='/create' element={<CreateRoomPage/>}/>
        <Route path='/room/:roomCode' 
          element={<Room roomCode={roomCode} leaveRoomCallback={clearRoomCode} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default HomePage;