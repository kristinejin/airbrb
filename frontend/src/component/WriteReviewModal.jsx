import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import GradeIcon from '@mui/icons-material/Grade';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';

import { apiCall } from '../util/api';

import React from 'react';

const WriteReviewModal = (props) => {
    const open = props.open;
    const setOpen = props.setOpen;
    const reviews = props.reviews;
    const setReviews = props.setReviews;
    const bookingId = props.bookingId;
    const listingId = props.listingId;
    const refresh = props.refresh;

    const [textValue, setTextValue] = React.useState('');
    const [ratingValue, setRatingValue] = React.useState(0);

    const submitReview = () => {
        const email = localStorage.getItem('email');
        const postedOn = new Date().toISOString();
        const newReview = {
            email,
            message: textValue,
            stars: ratingValue,
            postedOn,
        };

        apiCall(`listings/${listingId}/review/${bookingId}`, 'PUT', {
            review: newReview,
        }).then(() => {
            const allReviews = [...reviews];
            allReviews.push(newReview);
            setReviews(allReviews);
            refresh();
            setOpen(false);
        });
    };

    const handleTextChange = (event) => {
        setTextValue(event.target.value);
    };

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <IconButton onClick={() => setOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    value={textValue}
                    onChange={handleTextChange}
                    multiline
                    rows={4}
                    placeholder="How was your trip?"
                    fullWidth
                />

                <Box sx={{ paddingTop: '10px', display: 'flex' }}>
                    <Typography>Rate your stay: </Typography>
                    <Rating
                        value={ratingValue}
                        onChange={(event, newValue) => {
                            setRatingValue(newValue);
                        }}
                    />
                </Box>

                <Button sx={{ float: 'right' }} onClick={submitReview}>
                    Submit review
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default WriteReviewModal;
