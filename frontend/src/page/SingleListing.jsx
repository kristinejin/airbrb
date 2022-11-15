import React from 'react';
import { apiCall } from '../util/api';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import AdvancedRatingPopup from '../component/AdvancedRatingPopup';
import { getAverageRating } from '../util/averageRating';
import Rating from '@mui/material/Rating';
import * as dayjs from 'dayjs';

import { useParams, useNavigate } from 'react-router-dom';
import { SideMenu } from '../component/SideMenu';
import ReviewModal from '../component/ReviewModal';
import CustomDatePicker from '../component/DatePicker';
import Youtube from '../component/YouTube';

const clickable = {
  cursor: 'pointer',
  textDecorationLine: 'underline',
  fontWeight: '600',
};

const SingleListing = () => {
  const listingId = useParams().listingId;
  const dateRange = useParams().dateRange;
  const theme = useTheme();
  const nav = useNavigate();

  const [listing, setListing] = React.useState({});
  const [images, setImages] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isBooked, setIsBooked] = React.useState(false);
  const [bookingStatus, setBookingStatus] = React.useState(false);
  const [openReview, setOpenReview] = React.useState(false);
  const [bookedDates, setBookedDates] = React.useState({
    start: new Date(),
    end: new Date(),
  });
  const [maxSteps, setMaxSteps] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [bookingSuccess, setBookingSuccess] = React.useState(false);
  const [newBid, setNewBid] = React.useState(0);
  const [allReviews, setAllReviews] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);

  React.useEffect(() => {
    listingInfo()
      .then((data) => {
        setListing(data.listing);
        setMaxSteps(data.listing.metadata.images.length + 1);
        setImages([
          data.listing.thumbnail,
          ...data.listing.metadata.images,
        ]);
        setIsLoaded(true);
        setAllReviews(data.listing.reviews);
      })
      .catch((data) => {
        setIsLoaded(false);
        alert(data);
      });
  }, []);

  React.useEffect(() => {
    getAllBookings();
  }, [isBooked]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const listingInfo = async () => {
    const info = await apiCall(`listings/${listingId}`, 'GET');
    return info;
  };

  const refreshListing = () => {
    listingInfo().then((data) => {
      setListing(data.listing);
    });
  };

  const addressStr = () => {
    return `${listing.address.street}, ${listing.address.city}, ${listing.address.country} ${listing.address.postcode}`;
  };

  const handleOpenReview = () => {
    setOpenReview(true);
  };

  const openPopover = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }
  const closePopover = (event) => {
    if (event !== undefined) {
      event.stopPropagation();
      event.preventDefault();
    }
    setAnchorEl(null);
  }

  // For booking
  const handleOnChangeDateStart = (date) => {
    const ISODate = date.toISOString();
    const newBooked = bookedDates;
    newBooked.start = ISODate;
    setBookedDates(newBooked);
  };

  const handleOnChangeDateEnd = (date) => {
    const ISODate = date.toISOString();
    const newBooked = bookedDates;
    newBooked.end = ISODate;
    setBookedDates(newBooked);
  };

  const getAdjustedDate = (current) => {
    let adjusted = new Date(current);
    adjusted = new Date(
      adjusted.getTime() - adjusted.getTimezoneOffset() * 60000
    );
    adjusted = adjusted.toISOString();
    adjusted = adjusted.slice(0, -1);
    return adjusted;
  };

  const handleBook = async () => {
    const start = dayjs(bookedDates.start);
    const end = dayjs(bookedDates.end);
    const duration =
      end.diff(start, 'day') > 0 ? end.diff(start, 'day') : 1;
    const total = duration * parseInt(listing.price);

    const correctStart = getAdjustedDate(start.toISOString());
    const correctEnd = getAdjustedDate(end.toISOString());

    const request = await apiCall(`bookings/new/${listingId}`, 'POST', {
      dateRange: {
        startdate: correctStart,
        enddate: correctEnd,
      },
      totalPrice: total,
    });
    // popup showing booking status
    setNewBid(request.bookingId);
    setBookingSuccess(true);
  };

  const getAllBookings = async () => {
    const resp = await apiCall('bookings', 'GET');
    const bookings = resp.bookings;

    bookings.forEach((b) => {
      if (
        b.owner === localStorage.getItem('email') &&
        parseInt(b.listingId) === parseInt(listingId)
      ) {
        setIsBooked(true);
        setBookingStatus(b.status);
      }
    });
  };

  const ShowBookingStatus = () => {
    if (!localStorage.getItem('token')) {
      return null;
    }
    if (isBooked) {
      return (
        <Box>
          <Typography>
            Your booking status is {bookingStatus}
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // justifyContent:'center'
        }}
      >
        <Typography>You have not booked this property yet</Typography>
      </Box>
    );
  };

  const BookListing = () => {
    let price = listing.price;
    let priceLabel = 'per night';
    if (dateRange !== 'false') {
      // calculate total price
      const days = Math.abs(parseInt(dateRange));
      price *= days;
      priceLabel = `for total of ${days} day(s)`;
    }
    const BookingSection = () => {
      if (!localStorage.getItem('token')) {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography>
              Want to book this property? Login or sign up first!
            </Typography>
          </Box>
        );
      }

      return (
        <Box>
          <Grid2 container spacing={2} justifyContent='center'>
            <Grid2
              xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <CustomDatePicker
                fullWidth
                dateRange={{ start: null, end: null }}
                handleOnChangeDateEnd={handleOnChangeDateEnd}
                handleOnChangeDateStart={
                  handleOnChangeDateStart
                }
                availability={listing.availability}
              />
            </Grid2>
            <Grid2
              xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <Typography variant='h7'>
                Total Price: (To be implemented w/ booking)
              </Typography>
            </Grid2>
            {bookingSuccess && (
              <Alert
                onClose={() => {
                  setBookingSuccess(false);
                }}
                severity='success'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <AlertTitle>
                  Congrats, this booking has been made.
                </AlertTitle>
                Your booking id is #{newBid}, you booking status
                will change once the host process your booking
              </Alert>
            )}

            <Grid2
              xs={12}
              md={8}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Button
                name='submit'
                fullWidth
                variant='outlined'
                sx={{ width: '90%' }}
                onClick={handleBook}
              >
                Book
              </Button>
            </Grid2>
          </Grid2>
        </Box>
      );
    };

    return (
      <Grid2 xs={12} md={8}>
        <Card
          fullWidth
          sx={{
            // width: '60vw',
            minHeight: '40vh',
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
              }}
            >
              <Typography variant='h5' sx={{ pr: 0.5 }}>
                ${price}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  // flexDirection:'column',
                  alignItems: 'center',
                }}
              >
                {priceLabel}
              </Typography>
            </Box>
            <Divider sx={{ m: 2 }}>Make a Booking</Divider>
            <BookingSection />
            {localStorage.getItem('token') && (
              <Divider sx={{ m: 2 }}>Booking Status</Divider>
            )}
            <ShowBookingStatus />
          </CardContent>
        </Card>
      </Grid2>
    );
  };

  if (!isLoaded || !maxSteps || images.length === 0 || !allReviews) {
    return <p>loading...</p>;
  }

  return (
    <Box>
      <Box
        sx={{ border: '1px solid rgb(230, 230, 230)', padding: '30px' }}
        justifyContent='space-between'
        alignItems='center'
        display='flex'
      >
        <Typography
          sx={{ flex: '1', cursor: 'pointer' }}
          component='h1'
          variant='h4'
          onClick={() => nav('/')}
        >
          airbrb
        </Typography>

        <Box sx={{ flex: '1' }}>
          <SideMenu />
        </Box>
      </Box>

      {/* Review Modal:  https://mui.com/joy-ui/react-modal/ */}

      <ReviewModal
        open={openReview}
        setOpen={setOpenReview}
        refresh={refreshListing}
        listingId={parseInt(listingId)}
        listing={listing}
        reviewsToShow={allReviews}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          alignSelf: 'center',
          gap: 3,
          m: 2,
        }}
      >
        <Typography variant='h2'>{listing.title}</Typography>
        <Grid2 container spacing={1}>
          <Grid2 sx={{ display: 'flex' }}>
            <Button sx={{ position: 'relative', bottom: '5px', left: '5px' }}
              onClick={openPopover}
              onMouseEnter={openPopover}
            >
              <Rating
              size='small'
              value={parseFloat(getAverageRating(listing.reviews), 10)}
              precision={0.5}
              readOnly
              />
              <KeyboardArrowDown sx={{ fill: 'gray' }}/>
            </Button>
            <AdvancedRatingPopup anchorEl={anchorEl} openPopover={openPopover} closePopover={closePopover} listing={listing}/>
          </Grid2>
          <Grid2>
            <Typography>|</Typography>
          </Grid2>
          <Grid2>
            {/* make clickable, view reviews */}
            <Typography
              onClick={handleOpenReview}
              style={clickable}
            >
              View all {listing.reviews.length} reviews
            </Typography>
          </Grid2>
          <Grid2>
            <Typography>|</Typography>
          </Grid2>
          <Grid2>
            <Typography>{addressStr()}</Typography>
          </Grid2>
        </Grid2>

        <Box sx={{ maxWidth: 500, flexGrow: 1 }}>
          {activeStep === 0 && listing.metadata.video
            ? (
              <Box
                sx={{
                  height: 300,
                  display: 'block',
                  maxWidth: 500,
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                <Youtube code={listing.metadata.video} />
              </Box>
              )
            : (
              <Box
                component='img'
                sx={{
                  height: 300,
                  display: 'block',
                  maxWidth: 500,
                  overflow: 'hidden',
                  width: '100%',
                }}
                src={images[activeStep]}
                alt='Listing Images'
              />
              )}

          <MobileStepper
            steps={maxSteps}
            position='static'
            activeStep={activeStep}
            nextButton={
              <Button
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                {theme.direction === 'rtl'
                  ? (
                    <KeyboardArrowLeft />
                    )
                  : (
                    <KeyboardArrowRight />
                    )}
              </Button>
            }
            backButton={
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === 'rtl'
                  ? (
                    <KeyboardArrowRight />
                    )
                  : (
                    <KeyboardArrowLeft />
                    )}
              </Button>
            }
          />
        </Box>

        <Grid2 container spacing={1}>
          <Grid2>
            <Typography>{listing.metadata.propertyType}</Typography>
          </Grid2>
          <Grid2>
            <Typography>|</Typography>
          </Grid2>
          <Grid2>
            <Typography>
              {listing.metadata.numBedrooms} bedrooms
            </Typography>
          </Grid2>
          <Grid2>
            <Typography>|</Typography>
          </Grid2>
          <Grid2>
            <Typography>{listing.metadata.numBeds} beds</Typography>
          </Grid2>
          <Grid2>
            <Typography>|</Typography>
          </Grid2>
          <Grid2>
            <Typography>
              {listing.metadata.numBaths} bathrooms
            </Typography>
          </Grid2>
        </Grid2>

        <Typography>Amenities: {listing.metadata.amenities}</Typography>

        <BookListing sx={{ width: '80vw' }} />
      </Box>
    </Box>
  );
};

export default SingleListing;
