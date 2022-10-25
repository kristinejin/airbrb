import React from "react";
import { useState } from "react";

import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button'
import Box from '@mui/material/Box';

import { sendRequest } from "../requests.js";
import  { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    // const [err, setErrMsg] = useState('');

    const setLogin = (token) => {
        localStorage.setItem('token', token);
    }
    
    const nav = useNavigate();
    const validateInput = () => {
        // email regex? 
        // username not empty 
        // password matching
        if (password !== confirmPass) {
            // setErrMsg('Password do not match');
            return;
        }

        sendRequest({
            route: 'user/auth/register',
            method: 'POST',
            body: {
                email: email,
                password: password,
                name: username
            }
        }).then(data => {
            setLogin(data.token);
            // redirect to logged in page
            nav('/hosted/listings');
        }).catch(data => {
            console.log(data);
        })
    }
    

    return (
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField 
                label="Email" 
                placeholder="Email" 
                onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <TextField 
                label="Username" 
                placeholder="Username" 
                onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div>
            <TextField 
                label="Password" 
                placeholder="Password" type="password" 
                onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div>
            <TextField 
                label="Confirm Password" 
                placeholder="Confirm Password" 
                type="password" 
                onChange={e => setConfirmPass(e.target.value)}
            />
          </div>

          <div>
            <Button variant="contained" onClick={validateInput}>
                Register
            </Button>
          </div>
        </Box>
      );
}

export default Register