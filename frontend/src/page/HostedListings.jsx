import React from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import { withStyles } from '@mui/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Plot from 'react-plotly.js';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import Toolbar from '@mui/material/Toolbar';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import HostedListingCard from '../component/HostedListingCard';
import { SideMenu } from '../component/SideMenu';
import CreateDialog from '../component/CreateDialog';
import UploadListing from '../component/UploadListing';

import { apiCall } from '../util/api';

// import FullScreenDialog from './ListingCreate';

const styles = theme => ({
})

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const HostedListings = (props) => {
  const userEmail = localStorage.getItem('email');
  const [listings, setListings] = React.useState('');
  const [create, setCreate] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [upload, setUpload] = React.useState(false);
  const [publishId, setPublishId] = React.useState(null);
  let correctDate = new Date();
  correctDate = new Date(correctDate.getTime() - correctDate.getTimezoneOffset() * 60000);
  correctDate = correctDate.toISOString();
  correctDate = correctDate.slice(0, -1);
  const [availability, setAvailability] = React.useState([{ start: correctDate, end: correctDate }]);

  const [xAxis, setXAxis] = React.useState('');
  const [yAxis, setYAxis] = React.useState('');

  const createGraph = async (allListings) => {
    const allListingIds = [];
    allListings.forEach((listing) => {
      allListingIds.push(listing.id);
    });

    const x = [];
    for (let i = 1; i <= 30; i++) {
      x.push(i);
    }
    setXAxis(x);

    const data = await apiCall('bookings', 'GET');
    const bookings = [];
    data.bookings.forEach((booking) => {
      if (booking.status === 'accepted' && allListingIds.includes(parseInt(booking.listingId, 10))) {
        bookings.push(booking);
      }
    });

    const y = [];
    x.forEach((day) => {
      const currDay = new Date();
      let totalProfit = 0;
      currDay.setDate(currDay.getDate() - 30 + day);
      bookings.forEach((booking) => {
        const idIndex = allListingIds.indexOf(parseInt(booking.listingId, 10));
        const bookedListing = allListings[idIndex];
        const listingPrice = bookedListing.price;
        const startDate = new Date(booking.dateRange.startdate);
        const endDate = new Date(booking.dateRange.enddate);
        if (currDay <= endDate && currDay >= startDate) {
          totalProfit += parseInt(listingPrice, 10);
        }
      })
      y.push(totalProfit);
    })
    setYAxis(y);
  }

  const handleOpen = (pId) => {
    setOpen(true);
    setPublishId(pId);
  }
  const handleClose = () => {
    setOpen(false);
    setPublishId(null);
    let correctDate = new Date();
    correctDate = new Date(correctDate.getTime() - correctDate.getTimezoneOffset() * 60000);
    correctDate = correctDate.toISOString()
    correctDate = correctDate.slice(0, -1);
    setAvailability([{ start: correctDate, end: correctDate }]);
  }

  const handleOnChangeDateStart = (index, newDate) => {
    const currentAvailabilities = [...availability];
    let correctDate = newDate.$d;
    correctDate = new Date(correctDate.getTime() - correctDate.getTimezoneOffset() * 60000);
    correctDate = correctDate.toISOString()
    correctDate = correctDate.slice(0, -1);
    currentAvailabilities[index].start = correctDate;
    setAvailability(currentAvailabilities);
  }

  const handleOnChangeDateEnd = (index, newDate) => {
    const currentAvailabilities = [...availability];
    let correctDate = newDate.$d;
    correctDate = new Date(correctDate.getTime() - correctDate.getTimezoneOffset() * 60000);
    correctDate = correctDate.toISOString()
    correctDate = correctDate.slice(0, -1);
    currentAvailabilities[index].end = correctDate;
    setAvailability(currentAvailabilities);
  }

  const addAvailability = () => {
    let correctDate = new Date();
    correctDate = new Date(correctDate.getTime() - correctDate.getTimezoneOffset() * 60000);
    correctDate = correctDate.toISOString()
    correctDate = correctDate.slice(0, -1);
    const newAvailabilityObj = { start: correctDate, end: correctDate };
    const currentAvailabilities = [...availability];
    currentAvailabilities.push(newAvailabilityObj);
    setAvailability(currentAvailabilities);
  }

  const getListings = () => {
    apiCall('listings', 'GET')
      .then((data) => {
        const hostedListingsPromises = [];
        const hostedListingsIds = [];
        data.listings.forEach((listing) => {
          if (listing.owner === userEmail) {
            hostedListingsPromises.push(apiCall(`listings/${listing.id}`, 'GET'));
            hostedListingsIds.push(listing.id);
          }
        });
        const responses = Promise.all(hostedListingsPromises);
        responses.then(response => {
          const hostedListings = [];
          let i = 0;
          response.forEach(listing => {
            listing.listing.id = hostedListingsIds[i];
            hostedListings.push(listing.listing);
            i += 1;
          });

          createGraph(hostedListings).then(() => {
            setListings(hostedListings);
          })
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

  /*
    Publish / Unpublish Listings
  */

  const publishListing = (listingId) => {
    const allAvailability = { availability };
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

  React.useEffect(() => {
    getListings();
  }, [])

  if (!listings || !xAxis || !yAxis) {
    return <>Loading...</>
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
            edge='start'
            color='inherit'
            onClick={setCreateClose}
            aria-label='close'
            >
            <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
              Create a new listing
            </Typography>
          </Toolbar>
          <CreateDialog callCreateListing={e => callCreateListing(e)}/>
        </Dialog>
      </div>
    )
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <UploadListing
        open={upload}
        handleClose={setUpload}
        handleCreate={callCreateListing}
      />

      <Box sx={{ border: '1px solid rgb(230, 230, 230)', padding: '30px' }} justifyContent='space-between' alignItems='center' display='flex'>
        <Box sx={{ flex: '1' }} >
          <Button sx={{ fontSize: '20px' }} onClick={() => { window.location.href = '/' }}><HomeIcon sx={{ height: '30px', width: '30px', verticalAlign: 'middle' }}/>Go Home</Button>
        </Box>
        <Typography sx={{ flex: '1', textAlign: 'center' }} component='h1' variant='h4'>Your listings</Typography>
        <Box sx={{ flex: '1' }}>
          <SideMenu/>
        </Box>
      </Box>

      <Box sx={{ width: '100%', height: '100%', padding: '40px' }}>
        <Plot
          data={[
            {
              x: xAxis,
              y: yAxis,
              type: 'bar',
              mode: 'lines+markers',
              marker: { color: 'red' },
            },
          ]}
          layout={{ autosize: true, title: 'Your listing profits' }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>

      <Box
        sx={{
          padding: '30px 40px 0 40px',
          // display: 'flex',
          // flexDirection: 'column',
          // alignItems: 'flex-start',
        }}
      >
        <Button onClick={() => setCreate(true)}>
          Create New Listing
        </Button>
        <Button onClick={() => setUpload(true)}>
          Upload New Listing
        </Button>
      </Box>

      <Box sx={{ padding: '40px' }}>
        <Grid container rowSpacing={3} columnSpacing={3}>
          {listings.map((data) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={data.id}>
              <HostedListingCard unPublishListing={unPublishListing} deleteListing={deleteListing} handleOpen={handleOpen} listing={data}/>
              <Card sx={{ textAlign: 'center' }}>
                <Button sx={{ width: '100%' }} onClick={() => { window.location.href = `/BookingHistory/${data.id}` }}>View Booking History</Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Set availability</DialogTitle>
        <DialogContent>
          {availability.map((data, index) => (
            <Box key={index} sx={{ paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>

                <DesktopDatePicker
                  label='Start Date'
                  inputFormat='MM/DD/YYYY'
                  value={data.start}
                  onChange={(newVal) => { handleOnChangeDateStart(index, newVal) }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Typography> - </Typography>
                <DesktopDatePicker
                  label='End Date'
                  inputFormat='MM/DD/YYYY'
                  value={data.end}
                  onChange={(newVal) => { handleOnChangeDateEnd(index, newVal) }}
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
