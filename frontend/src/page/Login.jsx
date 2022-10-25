import React from 'react'

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { withStyles } from '@mui/styles';
import { apiCall } from '../util/api';

const styles = theme => ({
    main: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto',
        height: 'auto',
    },
    loginBox: {
        marginTop: '20px',
        display:'flex',
        flexDirection: 'column',
        width: '400px',
        gap: '10px',
    },
    loginbuttons: {

    }
})

const Login = (props) => {
    const [userEmail, setUserEmail] = React.useState('');
    const [userPassword, setUserPassword] = React.useState('');
    const signIn = (email, password) => {
        apiCall('user/auth/login', 'POST', { "email": email, "password": password })
            .then((data) => {
                console.log(data.token);
                localStorage.setItem("token", data.token);
                localStorage.setItem("email", email);
                window.location.href="/hostedlistings";
            })
    }

    const {classes} = props;
    return (
        <main className={classes.main}>
            <Box className={classes.loginBox}>
                <Typography component="h1" variant="h5">
                    Sign in to AirBNB
                </Typography>
                <TextField fullWidth className={classes.loginfield} id="email" label="Email" value={userEmail} onChange={e => setUserEmail(e.target.value)}></TextField>
                <TextField fullWidth className={classes.loginfield} id="password" label="Password" value={userPassword} onChange={e => setUserPassword(e.target.value)}></TextField>

                <Box className={classes.loginbuttons}>
                    <Button onClick={() => signIn(userEmail, userPassword)}>Sign in</Button>
                    <Button>Register</Button>
                </Box>
            </Box>
        </main>
    )
}

export default withStyles(styles)(Login);