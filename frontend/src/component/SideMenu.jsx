import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DehazeIcon from '@mui/icons-material/Dehaze';
import PropTypes from 'prop-types';

import { apiCall } from '../util/api';

export const SideMenu = (props) => {
  const testProp = props.showMenu;
  const userEmail = localStorage.getItem('email');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    apiCall('user/auth/logout', 'POST').then((_) => {
      handleClose();
      localStorage.clear();
      window.location.href = '/';
    });
  };

  const handleViewListings = () => {
    handleClose();
    window.location.href = '/hostedlistings';
  };

  if (userEmail || testProp) {
    return (
      <Box>
        <Button
          id='sideButton'
          sx={{ float: 'right' }}
          onClick={handleClick}
          aria-controls={open ? 'sideMenu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <DehazeIcon />
        </Button>
        <Menu
          id='sideMenu'
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
    );
  } else {
    return (
      <Box>
        <RegisterButton onClick={() => { window.location.href = '/register' }} />
        <SignInButton onClick={() => { window.location.href = '/login' }} />
      </Box>
    );
  }
};

export const RegisterButton = ({ onClick }) => {
  return (
    <Button
      sx={{ float: 'right' }}
      onClick={onClick}
    >
      Register
    </Button>
  )
}

export const SignInButton = ({ onClick }) => {
  return (
    <Button
      sx={{ float: 'right' }}
      onClick={onClick}
    >
      Sign in
    </Button>
  )
}

SideMenu.propTypes = {
  showMenu: PropTypes.bool
};
RegisterButton.propTypes = {
  onClick: PropTypes.func
};
SignInButton.propTypes = {
  onClick: PropTypes.func
};
