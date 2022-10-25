import React from 'react';

import {
    Routes,
    Route,
} from 'react-router-dom';

import LandingPage from './page/LandingPage';
import Login from './page/Login';
import HostedListings from './page/HostedListings';


const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/HostedListings" element={<HostedListings/>} />
        </Routes>
    );
}

export default Router;