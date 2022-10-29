import React from 'react'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import CribIcon from '@mui/icons-material/Crib';
import AirlineSeatLegroomNormalIcon from '@mui/icons-material/AirlineSeatLegroomNormal';
import { useNavigate } from 'react-router-dom';

const HostedListingCard = (props) => {
	const listing = props.listing;
	const deleteListing = props.deleteListing;
	const publishListing = props.publishListing;
	const unPublishListing = props.unPublishListing;
	const nav = useNavigate();
	return (
		<Card>
			<CardActionArea onClick={() => {nav(`/HostedListings/edit/${listing.id}`)}}>
				<CardHeader 
					sx={{
						display: "flex",
						overflow: "hidden",
						"& .MuiCardHeader-content": {
								overflow: "hidden"
						}
					}}
					title={listing.title}
					titleTypographyProps={{ noWrap: true}}
					action={
						<IconButton aria-label="settings" onClick={event => {
							event.stopPropagation();
							event.preventDefault();
							deleteListing(listing.id);
						}}>
							<DeleteIcon/>
						</IconButton>
					}
				/>
				<CardMedia
					component="img"
					image={listing.thumbnail}
					alt="Listing thumbnail"
				/>       
				<CardContent>
					<Box justifyContent="space-between" alignItems="center" display="flex">
						<Typography>House</Typography>
						<Typography>5.8<StarIcon style={{verticalAlign:"middle"}}/></Typography>
					</Box>
					<Box justifyContent="space-between" alignItems="center" display="flex">
						<Box gap="5px" justifyContent="space-between" alignItems="center" display="flex">
							<Typography>3<CribIcon style={{verticalAlign:"middle"}}/></Typography>
							<Typography>4<AirlineSeatLegroomNormalIcon style={{verticalAlign:"middle"}}/></Typography>
						</Box>
						<Typography>{listing.reviews.length} Reviews</Typography>
					</Box>

					<Box  sx={{position: 'relative', top: '10px'}} justifyContent="space-between" alignItems="center" display="flex">
						<Typography sx={{textDecoration: 'underline'}}>
							<Typography sx={{fontWeight:'bold'}} display="inline">
								${listing.price} AUD   
							</Typography>
							&nbsp; per night
						</Typography>

						{listing.published ? (<Button onClick={event => {
							event.stopPropagation();
							event.preventDefault();
							unPublishListing(listing.id);
						}}>Unpublish</Button>) : (<Button onClick={event => {
							event.stopPropagation();
							event.preventDefault();
							publishListing(listing.id);
						}}>publish</Button>)}

						
					</Box>
					
				</CardContent>   
			</CardActionArea>          
		</Card>
	)
}

export default HostedListingCard;