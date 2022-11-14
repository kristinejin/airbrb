import React from 'react';

import { Routes, Route } from 'react-router-dom';

import LandingPage from './page/LandingPage';
import Login from './page/Login';
import HostedListings from './page/HostedListings';
import Register from './page/Register';
import ListingEdit from './page/ListingEdit';
import BookingHistory from './page/BookingHistory';
import SingleListing from './page/SingleListing';

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/HostedListings" element={<HostedListings />} />
            <Route
                path="/HostedListings/edit/:listingId"
                element={<ListingEdit />}
            />
            <Route path="/BookingHistory/:id" element={<BookingHistory />} />
            <Route
                path="/listings/:listingId/:dateRange"
                element={<SingleListing />}
            />
        </Routes>
    );
};

export default Router;
