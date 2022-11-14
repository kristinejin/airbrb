import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { apiCall } from '../util/api.js';
import { useNavigate } from 'react-router-dom';

export const setLogin = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
};

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const doRegister = () => {
        const body = {
            email,
            password,
            name: username,
        };

        apiCall('user/auth/register', 'POST', body).then((data) => {
            setLogin(data.token, email);
            // redirect to logged in page
            nav('/HostedListings');
        });
    };

    const nav = useNavigate();
    const validateInput = () => {
        if (!username) {
            alert('Name cannot be empty');
            return;
            // change the input field to error mode?
        }
        // password matching
        if (password !== confirmPass) {
            alert('Password does not match');
            return;
        }

        doRegister();
    };

    return (
        <Box
            sx={{
                // '& .MuiTextField-root': { m: 1, width: '25ch' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'auto',
                height: 'auto',
            }}
        >
            <Box
                component="form"
                sx={{
                    // '& .MuiTextField-root': { m: 1, width: '25ch' },
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '400px',
                    gap: '10px',
                }}
                noValidate
                autoComplete="off"
            >
                <Typography component="h1" variant="h5">
                    Register your Airbnb account
                </Typography>
                <TextField
                    label="Email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Name"
                    placeholder="Name"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                    label="Password"
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <TextField
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    type="password"
                    onChange={(e) => setConfirmPass(e.target.value)}
                />

                <Box>
                    <Button variant="contained" onClick={validateInput}>
                        Register
                    </Button>
                    <Button onClick={() => nav('/login')}>Sign in</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Register;
