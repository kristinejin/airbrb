import React, { useState } from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import CribIcon from '@mui/icons-material/Crib';
import AirlineSeatLegroomNormalIcon from '@mui/icons-material/AirlineSeatLegroomNormal';
import HomeIcon from '@mui/icons-material/Home';
import { withStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import Toolbar from '@mui/material/Toolbar';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';


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
	
	const [open, setOpen] = React.useState(false);
	const [publishId, setPublishId] = React.useState(null);
	const [availability, setAvailability] = React.useState([{"start": new Date(), "end": new Date()}]);
	const handleOpen = (pId) => {
		setOpen(true);
		setPublishId(pId);
	}
	const handleClose = () => {
		setOpen(false); 
		setPublishId(null);
		setAvailability([{"start": new Date(), "end": new Date()}]);
	}

	const handleOnChangeDateStart = (index, newDate) => {
		const currentAvailabilities = [...availability];
		currentAvailabilities[index].start = newDate;
		setAvailability(currentAvailabilities);
	}

	const handleOnChangeDateEnd = (index, newDate) => {
		const currentAvailabilities = [...availability];
		currentAvailabilities[index].end = newDate;
		setAvailability(currentAvailabilities);
	}

	const addAvailability = () => {
		const newAvailabilityObj = {"start": new Date(), "end": new Date()};
		const currentAvailabilities = [...availability];
		currentAvailabilities.push(newAvailabilityObj);
		setAvailability(currentAvailabilities);
	}


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

	/*
		Publish / Unpublish Listings
	*/

	const publishListing = (listingId) => {
		const allAvailability = {"availability": availability};
		apiCall(`listings/publish/${listingId}`, 'PUT', allAvailability).then(_ => {
			const currentListing = [...listings];
			const getIndex = currentListing.findIndex(obj => obj.id === listingId);
			currentListing[getIndex].published = true;
			setListings(currentListing);
			handleClose();
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
				getListings();
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
							<HostedListingCard unPublishListing={unPublishListing} deleteListing={deleteListing} handleOpen={handleOpen} listing={data}/>
							<Card sx={{textAlign: "center"}}>
								<Button sx={{width: "100%"}} onClick={() => {window.location.href=`/BookingHistory/${data.id}`}}>View Booking History</Button>
							</Card>
						</Grid>
					))}
				</Grid>
			</Box>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Set availability</DialogTitle>
				<DialogContent>
					{availability.map((data, index) => (
						<Box sx={{paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '5px'}}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>

								<DesktopDatePicker
									label="Start Date"
									inputFormat="MM/DD/YYYY"
									value={data.start}
									onChange={(newVal) => {handleOnChangeDateStart(index, newVal)}}
									renderInput={(params) => <TextField {...params} />}
								/>
								<Typography> - </Typography>
								<DesktopDatePicker
									label="End Date"
									inputFormat="MM/DD/YYYY"
									value={data.end}
									onChange={(newVal) => {handleOnChangeDateEnd(index, newVal)}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>
							
						</Box>
					))}
				</DialogContent>
				<DialogActions>
					<Button onClick={addAvailability}>Add an availability</Button>
					<Button onClick={() => publishListing(publishId)}>Submit</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}

export default withStyles(styles)(HostedListings);