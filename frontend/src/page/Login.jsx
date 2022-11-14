import React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { apiCall } from '../util/api';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
  const [userEmail, setUserEmail] = React.useState('');
  const [userPassword, setUserPassword] = React.useState('');
  const signIn = (email, password) => {
    apiCall('user/auth/login', 'POST', {
      email,
      password,
    }).then((data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);
      window.location.href = '/hostedlistings';
    });
  };

  const navigate = useNavigate();

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'auto', height: 'auto' }}>
      <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', width: '400px', gap: '10px' }}>
        <Typography component='h1' variant='h5'>
          Sign in to AirBNB
        </Typography>
        <TextField
          fullWidth
          id='email'
          label='Email'
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        ></TextField>
        <TextField
          fullWidth
          id='password'
          label='Password'
          type='password'
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        ></TextField>

        <Box>
          <Button onClick={() => signIn(userEmail, userPassword)}>
            Sign in
          </Button>
          <Button onClick={() => navigate('/register')}>
            Register
          </Button>
        </Box>
      </Box>
    </main>
  );
};

export default Login;
