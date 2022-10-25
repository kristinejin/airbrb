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


const AllListingCard = (props) => {
	const listing = props.listing;

	return (
		<Card>
			<CardActionArea onClick={() => {console.log("hihi")}}>
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
				/>
				<CardMedia
					component="img"
					image={listing.thumbnail}
					alt="Listing thumbnail"
				/>       
				<CardContent>
					<Box justifyContent="space-between" alignItems="center" display="flex">
						<Typography>{listing.reviews.length} Reviews</Typography>
					</Box>

					<Box  sx={{position: 'relative', top: '10px'}} justifyContent="space-between" alignItems="center" display="flex">
						<Typography sx={{textDecoration: 'underline'}}>
							<Typography sx={{fontWeight:'bold'}} display="inline">
								${listing.price} AUD   
							</Typography>
							&nbsp; per night
						</Typography>
					</Box>
					
				</CardContent>   
			</CardActionArea>          
		</Card>
	)
}

export default AllListingCard;