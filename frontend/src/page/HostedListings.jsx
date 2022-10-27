import React, { useState } from 'react'

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { CardActionArea } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import CribIcon from '@mui/icons-material/Crib';
import AirlineSeatLegroomNormalIcon from '@mui/icons-material/AirlineSeatLegroomNormal';
import HomeIcon from '@mui/icons-material/Home';
import { withStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import HostedListingCard from '../component/HostedListingCard';
import SideMenu from '../component/SideMenu';
import CreateDialog from '../component/CreateDialog';

import { apiCall } from '../util/api';
// import FullScreenDialog from './ListingCreate';

const styles = theme => ({
})

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const HostedListings = (props) => {
    const user_email = localStorage.getItem("email");
    const [listings, setListings] = React.useState('');
	const [create, setCreate] = React.useState(false);
	

    const getListings = () => {
        apiCall('listings', 'GET')
            .then((data) => {
                let hostedListingsPromises = [];
                let hostedListingsIds = [];
                data.listings.forEach((listing) => {
                    if (listing.owner === user_email) {
                        hostedListingsPromises.push(apiCall(`listings/${listing.id}`, 'GET'));
                        hostedListingsIds.push(listing.id);
                    }
                }); 
                const responses = Promise.all(hostedListingsPromises);
                responses.then(response => {
                    let hostedListings = [];
                    let i = 0;
                    response.forEach(listing => {
                        listing.listing.id = hostedListingsIds[i];
                        hostedListings.push(listing.listing);
                        i += 1;
                    });

                    setListings(hostedListings);
                })
            });
    };

    const deleteListing = (listingId) => {
        apiCall(`listings/${listingId}`, 'DELETE').then(_ => {
            setListings((current) => 
                current.filter((currentListing) => currentListing.id !== listingId)
            )
        });
    }

	const publishListing = (listingId) => {
		const availability = {"availability": [{"start": 1, "end": 2}]};
		apiCall(`listings/publish/${listingId}`, 'PUT', availability).then(_ => {
			const currentListing = [...listings];
			const getIndex = currentListing.findIndex(obj => obj.id === listingId);
			currentListing[getIndex].published = true;
			setListings(currentListing);
		});
	}

	const unPublishListing = (listingId) => {
		apiCall(`listings/unpublish/${listingId}`, 'PUT').then(_ => {
			const currentListing = [...listings];
			const getIndex = currentListing.findIndex(obj => obj.id === listingId);
			currentListing[getIndex].published = false;
			setListings(currentListing);
		});
	}
	
    React.useEffect(() => {
        getListings();
    }, [])

	if (!listings) {
		return <>Loading...</>
	}
	const setCreateOpen = () => {
		setCreate(true);
	}
	const setCreateClose = () => {
		setCreate(false);
	}
	const callCreateListing = (data) => {
		apiCall('listings/new', 'POST', data)
			.then(data => {
				setCreateClose();
				// TODO: call getListing to fetch data?
			})
	}

	if (create) {
		return (
			<div>
				<Dialog
					fullScreen
					open={create}
					onClose={setCreateClose}
					TransitionComponent={Transition}
				>
					<Toolbar>
						<IconButton
						edge="start"
						color="inherit"
						onClick={setCreateClose}
						aria-label="close"
						>
						<CloseIcon />
						</IconButton>
						<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
							Create a new listing
						</Typography>
						{/* <Button autoFocus color="inherit" onClick={setCreateClose}>
						save
						</Button> */}
					</Toolbar>
					<CreateDialog callCreateListing={e => callCreateListing(e)}/>
				</Dialog>
			</div>
		)
	}

    const {classes} = props;
    return (
			<Box>
				<Box sx={{border: '1px solid rgb(230, 230, 230)', padding: '30px'}} justifyContent="space-between" alignItems="center" display="flex">
					<Box sx={{flex: '1'}} >
						<Button sx={{fontSize: "20px"}} onClick={() => {window.location.href="/"}}><HomeIcon sx={{height:"30px", width:"30px", verticalAlign:"middle"}}/>Go Home</Button>
					</Box>
					<Typography sx={{flex: '1', textAlign: "center"}} component="h1" variant="h4">Your listings</Typography>
					<Box sx={{flex: '1'}}>
						<SideMenu/>
					</Box>
				</Box>
				<Box sx={{padding: '40px'}}>
					<Button onClick={setCreateOpen}>Create New Listing</Button>
					<Grid container rowSpacing={3} columnSpacing={3}>
						{listings.map((data) => (
						<Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={data.id}>
							<HostedListingCard unPublishListing={unPublishListing} publishListing={publishListing} deleteListing={deleteListing} listing={data}/>
						</Grid>
						))}
					</Grid>
				</Box>
			</Box>
    )
}

export default withStyles(styles)(HostedListings);