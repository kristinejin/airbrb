import React from 'react';

import {
    Routes,
    Route,
} from 'react-router-dom';

import LandingPage from './page/LandingPage';
import Login from './page/Login';
import HostedListings from './page/HostedListings';
import BookingHistory from './page/BookingHistory';


const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/HostedListings" element={<HostedListings/>} />
            <Route path="/BookingHistory/:id" element={<BookingHistory/>}/>
        </Routes>
    );
}

export default Router;