import Typography from "@mui/material/Typography";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { makeStyles, withStyles } from "@mui/styles";

import ReviewModal from "../component/ReviewModal";
import LinearProgress from "@mui/material/LinearProgress";

import React from "react";
const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const AdvancedRatingPopup = (props) => {
    // Customisation of progress bar from https://mui.com/material-ui/react-progress/
    const BorderLinearProgress = withStyles((theme) => ({
        root: {
            borderRadius: 3,
        },
        bar: {
            backgroundColor: "orange !important",
        },
    }))(LinearProgress);

    const anchorEl = props.anchorEl;
    const openPopover = props.openPopover;
    const closePopover = props.closePopover;
    const listing = props.listing;

    const [openReview, setOpenReview] = React.useState(false);
    const [currReviews, setCurrReviews] = React.useState("");
    const open = Boolean(anchorEl);
    const [reviewTotal, setReviewTotal] = React.useState([
        [],
        [],
        [],
        [],
        [],
        [],
    ]);

    const setAllReviews = () => {
        let allReviews = [[], [], [], [], [], []];
        listing.reviews.forEach((review) => {
            allReviews[review.stars].push(review);
        });
        setReviewTotal(allReviews);
    };

    const openReviews = (star) => {
        setCurrReviews(reviewTotal[star]);
        setOpenReview(true);
    };

    const calcPercentage = (star) => {
        return reviewTotal[star].length === 0
            ? 0
            : (reviewTotal[star].length / listing.reviews.length).toFixed(2) *
                  100;
    };

    React.useEffect(() => {
        setAllReviews();
    }, []);

    const classes = useStyles();
    if (!reviewTotal) {
        return <>Loading...</>;
    }

    return (
        <React.Fragment>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={closePopover}
                onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                }}
                transformOrigin={{ horizontal: "left", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
            >
                <MenuItem
                    sx={{ gap: "10px" }}
                    onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        openReviews(5);
                        closePopover();
                    }}
                >
                    <Typography sx={{ color: "#172B4D" }}>5 star</Typography>
                    <div className={classes.root}>
                        <BorderLinearProgress
                            sx={{ height: "20px", width: "200px" }}
                            variant="determinate"
                            value={calcPercentage(5)}
                        />
                    </div>
                    <Typography>{calcPercentage(5)}%</Typography>
                </MenuItem>
                <MenuItem
                    sx={{ gap: "10px" }}
                    onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        openReviews(4);
                        closePopover();
                    }}
                >
                    <Typography sx={{ color: "#172B4D" }}>4 star</Typography>
                    <div className={classes.root}>
                        <BorderLinearProgress
                            sx={{ height: "20px", width: "200px" }}
                            variant="determinate"
                            value={calcPercentage(4)}
                        />
                    </div>
                    <Typography>{calcPercentage(4)}%</Typography>
                </MenuItem>
                <MenuItem
                    sx={{ gap: "10px" }}
                    onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        openReviews(3);
                        closePopover();
                    }}
                >
                    <Typography sx={{ color: "#172B4D" }}>3 star</Typography>
                    <div className={classes.root}>
                        <BorderLinearProgress
                            sx={{ height: "20px", width: "200px" }}
                            variant="determinate"
                            value={calcPercentage(3)}
                        />
                    </div>
                    <Typography>{calcPercentage(3)}%</Typography>
                </MenuItem>
                <MenuItem
                    sx={{ gap: "10px" }}
                    onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        openReviews(2);
                        closePopover();
                    }}
                >
                    <Typography sx={{ color: "#172B4D" }}>2 star</Typography>
                    <div className={classes.root}>
                        <BorderLinearProgress
                            sx={{ height: "20px", width: "200px" }}
                            variant="determinate"
                            value={calcPercentage(2)}
                        />
                    </div>
                    <Typography>{calcPercentage(2)}%</Typography>
                </MenuItem>
                <MenuItem
                    sx={{ gap: "10px" }}
                    onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        openReviews(1);
                        closePopover();
                    }}
                >
                    <Typography sx={{ color: "#172B4D" }}>1 star</Typography>
                    <div className={classes.root}>
                        <BorderLinearProgress
                            sx={{ height: "20px", width: "200px" }}
                            variant="determinate"
                            value={calcPercentage(1)}
                        />
                    </div>
                    <Typography>{calcPercentage(1)}%</Typography>
                </MenuItem>
                <MenuItem
                    sx={{ gap: "10px" }}
                    onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        openReviews(0);
                        closePopover();
                    }}
                >
                    <Typography sx={{ color: "#172B4D" }}>0 star</Typography>
                    <div className={classes.root}>
                        <BorderLinearProgress
                            sx={{ height: "20px", width: "200px" }}
                            variant="determinate"
                            value={calcPercentage(0)}
                        />
                    </div>
                    <Typography>{calcPercentage(0)}%</Typography>
                </MenuItem>
            </Menu>

            {openReview && (
                <ReviewModal
                    open={openReview}
                    setOpen={setOpenReview}
                    refresh={null}
                    listingId={listing.id}
                    listing={listing}
                    reviewsToShow={currReviews}
                />
            )}
        </React.Fragment>
    );
};

export default AdvancedRatingPopup;
