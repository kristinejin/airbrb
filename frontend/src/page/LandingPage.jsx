import React from 'react'
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Slider, { SliderThumb } from '@mui/material/Slider';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import TuneIcon from '@mui/icons-material/Tune';
import dayjs, { Dayjs } from 'dayjs';

import Toolbar from '@mui/material/Toolbar';


import { withStyles } from '@mui/styles';

import AllListingCard from '../component/AllListingCard';
import SideMenu from '../component/SideMenu';
import BedIcon from '@mui/icons-material/Bed';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SearchIcon from '@mui/icons-material/Search';


import { apiCall } from '../util/api';
import Chip from '@mui/material/Chip';
import { useState } from 'react';
import FilterDialog from '../component/FilterDialog';


const styles = theme => ({
  searchBox: {
    flex: '1',
    width: '100%',
    border: '1px solid black'
  }
})

const LandingPage = (props) => {
  const user_email = localStorage.getItem("email");
  const [bookedListings, setBookedListings] = React.useState('');
  const [listings, setListings] = React.useState('');
	const [priceRange, setValue] = React.useState([20, 37]);
  const [searchStr, setSearchStr] = React.useState('');
  const [showFilters, setShowFileters] = React.useState(false);
  const [listingIds, setAllListingIds] = React.useState([]);

  const sortListings = (listingArray) => {
    const compare = (a,b) => {
      if (a.title < b.title) {
        return -1;
      } else if (a.title > b.title) {
        return 1;
      } else {
        return 0;
      }
    }
    listingArray.sort(compare);
  }

  const putBookedListingsFirst = (listingArray) => {
    if (!user_email) {
      setListings(listingArray);
      setBookedListings([]);
      return {};
    }

    apiCall('bookings', 'GET')
      .then((data) => {
      
        const bookedListingIds = [];
        data.bookings.forEach((booking) => {
          if (booking.owner === user_email) {
            bookedListingIds.push(booking.listingId);
          }
        });

        const allBookedListings = [];
        listingArray.forEach((listing) => {
          if (bookedListingIds.includes(listing.id.toString())) {
            allBookedListings.push(listing);
          } 
        });

        bookedListingIds.forEach((listingId) => {
          listingArray = listingArray.filter((listing) => listing.id.toString() !== listingId);
        });

        setBookedListings(allBookedListings);
        setListings(listingArray);
      })
  }

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

          sortListings(allListings);
          putBookedListingsFirst(allListings);
        })
      });
  };
    // const filteredListings = 

    const pushListings = async (data) => {
      let AllListingsPromises = [];
      let allListingsIds = [];
      data.forEach((listing) => {
        AllListingsPromises.push(apiCall(`listings/${listing.id}`, 'GET'));
        allListingsIds.push(listing.id);
      }); 
      const responses = await Promise.all(AllListingsPromises);
      let allListings = [];
      let i = 0;
      responses.forEach(listing => {
        if (listing.listing.published) {
          listing.listing.id = allListingsIds[i];
          allListings.push(listing.listing);
        }
        i += 1;
      });

      sortListings(allListings);
      putBookedListingsFirst(allListings);
    }

    const searchAction = async () => {
      const resp = await apiCall('listings', 'GET');
      const listings = resp.listings;
      const wordsList = searchStr.toLowerCase().split(' ');
      
      const filteredListings = listings.filter(
        l => {
          return (
            wordsList.some(w => l.title.toLowerCase().includes(w)) ||
            wordsList.some(w => l.address.city.toLowerCase().includes(w))
          )
        }
      )
      pushListings(filteredListings);
    }

    const handleSearchStrUpdate = (e) => {
      setSearchStr(e.target.value)
    }
    
    const handleClickFilters = () => {
      setShowFileters(showFilters ? false : true)
    }

    const addIdToListing = (listings, ids) => {
      const listingList = []
      for (const [i, l] of listings.entries()) {
        l.listing.id = ids[i]
        listingList.push(l.listing)
      }
      return listingList;
    }

    const getListingDetails = async() => {
      const resp = await apiCall('listings', 'GET');
      const listings = resp.listings;
      const promises = []
      const ids = [];
      const getListingDets = async (id) => {
        const listing = await apiCall(`listings/${id}`, 'GET');
        return listing;
      }
      
      listings.forEach(async (listing) => {
        ids.push(listing.id)
        promises.push(getListingDets(listing.id))
      })

      setAllListingIds(ids);
      return Promise.all(promises);
    }

    const filterNumBedrooms = async (min, max) => {
      const listingList = await getListingDetails();
      const listings  = addIdToListing(listingList, listingIds);

      const filteredListings = listings.filter(
        l => {
          return (
            parseInt(l.metadata.numBeds) <= parseInt(max) &&
            parseInt(l.metadata.numBeds) >= parseInt(min)
          )
        }
      )

      sortListings(filteredListings);
      setListings(filteredListings);
    }

    const checkDates = (avai, dateRange) => {
      const avaiDate = {start: new Date(avai.start), end: new Date(avai.end)};
      return (
        avaiDate.start.getTime() <= dateRange.start.valueOf() && 
        avaiDate.end.getTime() >= dateRange.end.valueOf()
      )
    }

    const filterDate = async (dateRange) => {
      const listingList = await getListingDetails();
      const listings  = addIdToListing(listingList, listingIds);
      
      const filteredListings = listings.filter(
        l => {
          const avai = l.availability;
          console.log(avai)
          return avai.some(a => checkDates(a, dateRange));
        }
      )

      sortListings(filteredListings);
      setListings(filteredListings);
    }

    const handleApplyFilters = (bedroom, date) => {
      if (bedroom.isFilter) {
        // apply num bed filters
        filterNumBedrooms(bedroom.min, bedroom.max)
      }
      if (date.isFilter) {
        // apply num bed filters
        filterDate(date.dateRange);
      }
      handleClickFilters();
    }

    React.useEffect(() => {
        getListings();
    }, [])

		if (!listings || !bookedListings) {
			return <>Loading...</>
		}

    const {classes} = props;
    return (
			<Box>
				<Box sx={{border: '1px solid rgb(230, 230, 230)', padding: '30px'}} justifyContent="space-between" alignItems="center" display="flex">
					<Typography sx={{flex: '1'}} component="h1" variant="h4">airbrb</Typography>
					{/* <InputBase 
            className={classes.searchBox} 
            placeholder="Search by location or listing title" 
            onChange={handleSearchStrUpdate}
          ></InputBase> */}
          <TextField
            placeholder="Search..." 
            size="small"
            sx={{
              width: '30vw'
            }}
            InputProps={{endAdornment: 
              <IconButton type="button" aria-label="search" onClick={searchAction}>
                <SearchIcon />
              </IconButton>
            }}
            onChange={handleSearchStrUpdate}
          >

          </TextField>

          <Chip 
            label="Filters" 
            onClick={handleClickFilters} 
            sx={{
              ml: 1
            }}
            // TuneIcon
            icon={<TuneIcon fontSize="small"/>}
          />

          <FilterDialog 
            open={showFilters} 
            handleClick={handleClickFilters}
            handleApply={handleApplyFilters}
          />
					<Box sx={{flex: '1'}}>
            <SideMenu/>
					</Box>
				</Box>
				<Box sx={{padding: '40px'}}>
          {bookedListings.length !== 0 &&
            <Typography component="h1" variant="h5">Your booked listings</Typography>
          }
					<Grid container rowSpacing={3} columnSpacing={3} sx={{paddingBottom: "30px"}}>
            {bookedListings.map((data) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={data.id}>
                <AllListingCard listing={data}/>
              </Grid>
            ))}
					</Grid>

          <Typography component="h1" variant="h5">All hosted listings</Typography>
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