import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import GradeIcon from "@mui/icons-material/Grade";
import Rating from "@mui/material/Rating";
import WriteReviewModal from "../component/WriteReviewModal";
import { getAverageRating } from "../util/averageRating";
import { apiCall } from "../util/api";

import React from "react";

const ReviewModal = (props) => {
    const open = props.open;
    const setOpen = props.setOpen;
    const listingInfo = props.listing;
    const listingId = props.listingId;
    const refresh = props.refresh;
    const reviewsToShow = props.reviewsToShow;
    const [childOpen, setChildOpen] = React.useState(false);
    const [bookingId, setBookingId] = React.useState(null);
    const [reviews, setReviews] = React.useState('');

    if (reviews !== reviewsToShow) {
      setReviews(reviewsToShow);
    }

    const handleOpenWrite = () => {
      apiCall("bookings", "GET")
        .then((data) => {
          let bookingId = null;
          data.bookings.forEach((booking) => {
            if (
              booking.owner === localStorage.getItem("email") &&
              parseInt(booking.listingId) === parseInt(listingId) &&
              booking.status === "accepted"
            ) {
              bookingId = booking.id;
            }
          });
          return bookingId;
        })
        .then((data) => {
          if (data !== null) {
            setBookingId(data);
            setChildOpen(true);
          } else {
            alert(
              "You do not have an accepted booking for this listing"
            );
          }
        });
    };

    const isoToDate = (isoString) => {
      const newDate = new Date(isoString);
      const dateArr = newDate.toString().split(" ");
      const dateString = "(" + dateArr[1] + " " + dateArr[2] + ") " + dateArr[3];
      return dateString;
    };

    if (!reviews) {
      return <>Loading...</>
    }

    return (
        <Dialog
            open={open}
            onClose={(event) => {
              event.stopPropagation();
              event.preventDefault();
              setOpen(false);
            }}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <IconButton onClick={() => setOpen(false)}>
                    <CloseIcon />
                </IconButton>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                        <GradeIcon
                            sx={{ position: "relative", top: "4px", pr: 0.4 }}
                        />
                        {getAverageRating(reviews)} | {reviews.length} reviews
                    </Typography>
                    {refresh !== null && <Button onClick={handleOpenWrite}>Write review</Button>}
                </Box>
            </DialogTitle>
            <DialogContent>
                <List>
                    {reviews.map((data) => (
                        <ListItem divider="true">
                            <Box sx={{ width: "100%" }}>
                                <ListItemText
                                    primary={
                                        <Typography>
                                            {data.email}
                                            <Rating
                                                sx={{
                                                    position: "relative",
                                                    top: "3px",
                                                    float: "right",
                                                }}
                                                size="small"
                                                value={data.stars}
                                                precision={0.5}
                                                readOnly
                                            />
                                        </Typography>
                                    }
                                    secondary={isoToDate(data.postedOn)}
                                />
                                <Typography sx={{ wordWrap: "break-word" }}>
                                    {data.message}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <WriteReviewModal
                open={childOpen}
                setOpen={setChildOpen}
                reviews={reviews}
                setReviews={setReviews}
                listingId={listingId}
                bookingId={bookingId}
                refresh={refresh}
            ></WriteReviewModal>
        </Dialog>
    );
};

export default ReviewModal;
