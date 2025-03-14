import React, {Component} from "react";
import RoomJoinPage from "./RoomJoinPage"
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import {BrowserRouter as Router, Route, Routes, Link, Navigate} from "react-router-dom"
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        };
        this.clearRoomCode = this.clearRoomCode.bind(this);
    }
    
    
    clearRoomCode() {
        this.setState({
            roomCode:null
        })
    }

    
    async componentDidMount() {
        fetch("/api/user-in-room")
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    roomCode: data.code,
                });
            });
        }
    
    renderHomePage() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>
                            Join a Room
                        </Button>
                        <Button color="secondary" to="/create" component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route path='/' 
                    element={
                        this.state.roomCode ? (
                            <Navigate to={`/room/${this.state.roomCode}`} />
                        ) : (
                            this.renderHomePage() // 或者直接写 <HomePage /> 如果 renderHomePage 返回 HomePage 组件
                        )
                    }/>
                    <Route path='/join' element={<RoomJoinPage></RoomJoinPage>}/>
                    <Route path='/create' element={<CreateRoomPage></CreateRoomPage>}/>
                    <Route path='/room/:roomCode' 
                        element={<Room leaveRoomCallback={this.clearRoomCode} />} />
                </Routes>
            </Router>
        );
    }
}

//const appDiv = document.getElementById("app")
//const root = ReactDOM.createRoot(appDiv); // 使用 createRoot
//root.render(<App name="Fei"/>, appDiv)