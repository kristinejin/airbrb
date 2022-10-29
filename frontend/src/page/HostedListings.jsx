import React from 'react'

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

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

import HostedListingCard from '../component/HostedListingCard';
import SideMenu from '../component/SideMenu';

import { apiCall } from '../util/api';

const styles = theme => ({
})

const HostedListings = (props) => {
    const user_email = localStorage.getItem("email");
    const [listings, setListings] = React.useState('');

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
					<Button>Create New Listing</Button>
					<Grid container rowSpacing={3} columnSpacing={3}>
						{listings.map((data) => (
							<Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={data.id}>
								<HostedListingCard unPublishListing={unPublishListing} publishListing={publishListing} deleteListing={deleteListing} listing={data}/>
                <Card sx={{textAlign: "center"}}>
                  <Button sx={{width: "100%"}} onClick={() => {window.location.href=`/BookingHistory/${data.id}`}}>View Booking History</Button>
                </Card>
							</Grid>
						))}
					</Grid>
				</Box>
			</Box>
    )
}

export default withStyles(styles)(HostedListings);