import React from 'react'

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
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

import { withStyles } from '@mui/styles';

import AllListingCard from '../component/AllListingCard';
import SideMenu from '../component/SideMenu';

import { apiCall } from '../util/api';

const styles = theme => ({
  searchBox: {
    flex: '1',
    width: '100%',
    border: '1px solid black'
  }
})

const LandingPage = (props) => {
    const [listings, setListings] = React.useState('');

    const getListings = () => {
      apiCall('listings', 'GET')
        .then((data) => {
          let AllListingsPromises = [];
          let allListingsIds = [];
          data.listings.forEach((listing) => {
            AllListingsPromises.push(apiCall(`listings/${listing.id}`, 'GET'));
            allListingsIds.push(listing.id);
          }); 
          const responses = Promise.all(AllListingsPromises);
          responses.then(response => {
            let allListings = [];
            let i = 0;
            response.forEach(listing => {
              if (listing.listing.published) {
                listing.listing.id = allListingsIds[i];
                allListings.push(listing.listing);
              }
              i += 1;
            });

            setListings(allListings);
          })
        });
  };


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
					<Typography sx={{flex: '1'}} component="h1" variant="h4">airbrb</Typography>
					<InputBase className={classes.searchBox} placeholder="Search..." ></InputBase>
					<Box sx={{flex: '1'}}>
            <SideMenu/>
					</Box>
				</Box>
				<Box sx={{padding: '40px'}}>
					<Grid container rowSpacing={3} columnSpacing={3}>
						{listings.map((data) => (
						<Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={data.id}>
							<AllListingCard listing={data}/>
						</Grid>
						))}
					</Grid>
				</Box>
			</Box>
    )
}

export default withStyles(styles)(LandingPage);