import React from 'react';

import {
    Routes,
    Route,
} from 'react-router-dom';

import LandingPage from './page/LandingPage';
import Login from './page/Login';
import HostedListings from './page/HostedListings';
<<<<<<< HEAD
import Register from './page/Register';
=======
import BookingHistory from './page/BookingHistory';
>>>>>>> master


const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/HostedListings" element={<HostedListings/>} />
            <Route path="/BookingHistory/:id" element={<BookingHistory/>}/>
        </Routes>
    );
}

export default Router;