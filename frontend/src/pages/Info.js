import React, { useState } from "react";
import { Grid, Button, Typography, IconButton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";


const pages = {
  JOIN: "pages.join",
  CREATE: "pages.create",
};

const joinInfo = () => {
  return "Join page";
};

const createInfo = () => {
  return "Create page";
};

const Info = () => {
  const [page, setPage] = useState(pages.JOIN);

  return (
    <Grid container spacing={1} direction="column" alignItems="center" sx={{ 
      minHeight: '100vh',
      p: 20,
    }}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          What is House Party?
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="body1">
          {page === pages.JOIN ? joinInfo() : createInfo()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <IconButton
          onClick={() => {
              page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE);
          }}
        >
          {page === pages.CREATE ? (<NavigateBeforeIcon/>) : (<NavigateNextIcon/>)}
        </IconButton>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default Info;