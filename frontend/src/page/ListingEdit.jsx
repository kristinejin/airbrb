import React, { useState, useEffect } from 'react';
import { apiCall } from '../util/api';
import CreateDialog from '../component/CreateDialog';

import { useParams, useNavigate } from 'react-router-dom';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';

const ListingEdit = (props) => {
    const listingId = useParams().listingId;
    const [listing, setListing] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    // // display all the listing information
    const getListing = async () => {
        const resp = await apiCall(`listings/${listingId}`, 'GET');
        return resp;
    };

    useEffect(() => {
        getListing()
            .then((data) => {
                setListing(data.listing);
                setIsLoaded(true);
            })
            .catch((data) => {
                setIsLoaded(false);
                alert(data);
            });
    }, []);

    const nav = useNavigate();
    const doEdit = async (body) => {
        // request to edit
        // go back to hosted listing page
        const resp = await apiCall(`listings/${listingId}`, 'PUT', body);
        console.log(resp);
        nav('/hostedListings');
    };

    if (!isLoaded) {
        return <p>loading...</p>;
    }

    return (
        <Grid2
            container
            spacing={0}
            direction="column"
            alignItems="center"
            sx={{
                mb: 8,
            }}
        >
            <Typography
                component="h1"
                variant="h4"
                sx={{
                    mt: 8,
                }}
            >
                Edit listing information
            </Typography>
            <Grid2
                xs={8}
                sx={{
                    mb: 4,
                }}
            >
                <IconButton onClick={() => nav('/hostedlistings')}>
                    <ArrowBackIcon />
                </IconButton>
            </Grid2>
            <CreateDialog
                callCreateListing={(e) => doEdit(e)}
                listingInfo={listing}
            />
        </Grid2>
    );
};

export default ListingEdit;
