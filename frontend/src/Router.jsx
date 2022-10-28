import React from 'react';

import {
    Routes,
    Route,
} from 'react-router-dom';

import LandingPage from './page/LandingPage';
import Login from './page/Login';
import HostedListings from './page/HostedListings';
import Register from './page/Register';
import ListingEdit from './page/ListingEdit';


const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/HostedListings" element={<HostedListings/>} />
            <Route path="/edit" element={<ListingEdit/>}/>
        </Routes>
    );
}

export default Router;