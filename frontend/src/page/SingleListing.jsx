import React from "react";
import { useParams } from "react-router-dom";
import { apiCall } from "../util/api";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2";
import GradeIcon from "@mui/icons-material/Grade";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";

import SideMenu from "../component/SideMenu";
import CustomDatePicker from "../component/DatePicker";

// TODO: improve on overall UI + mobile responsiveness

const clickable = {
    cursor: "pointer",
    textDecorationLine: "underline",
    fontWeight: "600",
};

const SingleListing = () => {
    // console.log(dateRange)
    const listingId = useParams().listingId;
    const dateRange = useParams().dateRange;
    const theme = useTheme();

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
            })
            .catch((data) => {
                setIsLoaded(false);
                alert(data);
            });
    }, []);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const listingInfo = async () => {
        const info = await apiCall(`listings/${listingId}`, "GET");
        return info;
    };

    const addressStr = () => {
        return `${listing.address.street}, ${listing.address.city}, ${listing.address.country} ${listing.address.postcode}`;
    };

    const handleOpenReview = () => {
        setOpenReview(true);
    };

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

    const handleBook = async () => {
        const start = new Date(bookedDates.start);
        const end = new Date(bookedDates.end);
        const duration = end - start;
        const request = await apiCall(`bookings/new/${listingId}`, "POST", {
            dateRange: {
                startdate: bookedDates.start,
                enddate: bookedDates.enddate,
            },
            totalPrice: duration * listing.price,
        });
        // popup showing booking status
        console.log(request);
        console.log(bookedDates);
        console.log(listing.availability);
    };

    const BookListing = () => {
        let price = listing.price;
        let priceLabel = "per night";
        if (dateRange !== "false") {
            // calculate total price
            const days = Math.abs(parseInt(dateRange));
            price *= days;
            priceLabel = `for total of ${days} day(s)`;
        }

        const BookingSection = () => {
            if (!localStorage.getItem("token")) {
                return (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography>
                            Want to book this property? Login or sign up first!
                        </Typography>
                    </Box>
                );
            }

            const getAllBookings = async () => {
                const resp = await apiCall("bookings", "GET");
                const bookings = resp.bookings;
                bookings.forEach((b) => {
                    if (b.owner === localStorage.getItem("email")) {
                        setIsBooked(true);
                        setBookingStatus(b.status);
                    }
                });
            };

            getAllBookings();

            const ShowBookingStatus = () => {
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
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            // justifyContent:'center'
                        }}
                    >
                        <Typography>
                            You have not booked this property yet
                        </Typography>
                    </Box>
                );
            };

            return (
                <Box>
                    <Grid2 container spacing={2}>
                        <Grid2
                            xs={12}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            {console.log(listing)}
                            <CustomDatePicker
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
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                            }}
                        >
                            <Typography variant="h7">
                                Total Price: (To be implemented w/ booking)
                            </Typography>
                        </Grid2>
                        {bookingSuccess && (
                            <Alert
                                onClose={() => {
                                    setBookingSuccess(false);
                                }}
                                severity="success"
                                sx={{
                                    display: "flex",
                                    // flexDirection: "column",
                                    alignItems: "center",
                                    // width: "60%",
                                }}
                            >
                                <AlertTitle>
                                    Congrats, this booking has been made.
                                </AlertTitle>
                                Your booking id is 38453843, you booking status
                                will change once the host process your booking
                            </Alert>
                        )}
                        <Grid2
                            xs={12}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Button
                                variant="outlined"
                                sx={{ width: "90%" }}
                                onClick={handleBook}
                            >
                                Book
                            </Button>
                        </Grid2>
                    </Grid2>

                    <Divider sx={{ m: 2 }}>Booking Status</Divider>

                    <ShowBookingStatus />
                </Box>
            );
        };

        return (
            <Grid2 xs={12} md={8}>
                <Card
                    fullWidth
                    sx={{
                        // width: "60vw",
                        minHeight: "40vh",
                    }}
                >
                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                            }}
                        >
                            <Typography variant="h5" sx={{ pr: 0.5 }}>
                                ${price}
                            </Typography>
                            <Typography
                                sx={{
                                    display: "flex",
                                    // flexDirection:'column',
                                    alignItems: "center",
                                }}
                            >
                                {priceLabel}
                            </Typography>
                        </Box>
                        <Divider sx={{ m: 2 }}>Make a Booking</Divider>
                        <BookingSection />
                    </CardContent>
                </Card>
            </Grid2>
        );
    };

    if (!isLoaded || !maxSteps || images.length === 0) {
        return <p>loading...</p>;
    }

    return (
        <Box>
            <Box
                sx={{ border: "1px solid rgb(230, 230, 230)", padding: "30px" }}
                justifyContent="space-between"
                alignItems="center"
                display="flex"
            >
                <Typography sx={{ flex: "1" }} component="h1" variant="h4">
                    airbrb
                </Typography>

                <Box sx={{ flex: "1" }}>
                    <SideMenu />
                </Box>
            </Box>

            {/* Review Modal:  https://mui.com/joy-ui/react-modal/ */}
            <React.Fragment>
                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={openReview}
                    onClose={() => setOpenReview(false)}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Sheet
                        variant="outlined"
                        sx={{
                            maxWidth: 500,
                            borderRadius: "md",
                            p: 3,
                            boxShadow: "lg",
                        }}
                    >
                        <ModalClose
                            variant="outlined"
                            sx={{
                                top: "calc(-1/4 * var(--IconButton-size))",
                                right: "calc(-1/4 * var(--IconButton-size))",
                                boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
                                borderRadius: "50%",
                                bgcolor: "white",
                            }}
                        />
                        <Typography
                            component="h2"
                            id="modal-title"
                            level="h4"
                            textColor="inherit"
                            fontWeight="lg"
                            mb={1}
                        >
                            This is the modal title
                        </Typography>
                        <Typography id="modal-desc" textColor="text.tertiary">
                            Make sure to use <code>aria-labelledby</code> on the
                            modal dialog with an optional{" "}
                            <code>aria-describedby</code> attribute.
                        </Typography>
                    </Sheet>
                </Modal>
            </React.Fragment>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    alignSelf: "center",
                    gap: 3,
                    m: 2,
                }}
            >
                <Typography variant="h2">{listing.title}</Typography>
                <Grid2 container spacing={1}>
                    <Grid2 sx={{ display: "flex" }}>
                        <GradeIcon fontSize="small" sx={{ pr: 0.4 }} />
                        {/* TODO: get average reviews */}
                        <Typography>5.8</Typography>
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
                            {listing.reviews.length} reviews
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
                    <Box
                        component="img"
                        sx={{
                            height: 300,
                            display: "block",
                            maxWidth: 500,
                            overflow: "hidden",
                            width: "100%",
                        }}
                        src={images[activeStep]}
                        alt="Listing Images"
                    />
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        nextButton={
                            <Button
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                            >
                                {theme.direction === "rtl" ? (
                                    <KeyboardArrowLeft />
                                ) : (
                                    <KeyboardArrowRight />
                                )}
                            </Button>
                        }
                        backButton={
                            <Button
                                onClick={handleBack}
                                disabled={activeStep === 0}
                            >
                                {theme.direction === "rtl" ? (
                                    <KeyboardArrowRight />
                                ) : (
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

                <BookListing sx={{ width: "80vw" }} />
            </Box>
        </Box>
    );
};

export default SingleListing;
