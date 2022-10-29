import React from 'react'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import CribIcon from '@mui/icons-material/Crib';
import AirlineSeatLegroomNormalIcon from '@mui/icons-material/AirlineSeatLegroomNormal';
import DehazeIcon from '@mui/icons-material/Dehaze';

import { withStyles } from '@mui/styles';

const styles = theme => ({
    sideMenu: {
        float: 'right'
    }
})

const SideMenu = (props) => {
  const user_email = localStorage.getItem("email");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleLogout = () => {
    handleClose();
    localStorage.clear();
    window.location.href="/";
  }

  const handleViewListings = () => {
    handleClose();
    window.location.href="/hostedlistings";
  }

  const {classes} = props;
  if (user_email) {
    return (
      <Box>
        <Button id='sideButton' className={classes.sideMenu} onClick={handleClick} aria-controls={open ? 'sideMenu' : undefined} aria-haspopup='true' aria-expanded={open ? 'true' : undefined}><DehazeIcon/></Button>
        <Menu
          id="sideMenu"
          anchorEl={anchorEl}
          open={open}
          MenuListProps={{
            'aria-labelledby': 'sideButton',
          }}
          onClose={handleClose}
        >
          <MenuItem onClick={handleViewListings}>Your Listings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          
        </Menu>
      </Box>
    )
  } else {
    return (
      <Box>
        <Button sx={{float: "right"}}>Register</Button>
        <Button sx={{float: "right"}} onClick={() => {window.location.href="/login"}}>Sign in</Button>
      </Box>
    )
  }
}

export default withStyles(styles)(SideMenu);