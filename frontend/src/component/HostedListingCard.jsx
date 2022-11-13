import React from "react";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import Rating from "@mui/material/Rating";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import StarIcon from "@mui/icons-material/Star";
import CribIcon from "@mui/icons-material/Crib";
import AirlineSeatLegroomNormalIcon from "@mui/icons-material/AirlineSeatLegroomNormal";
import { useNavigate } from "react-router-dom";
import Video from "./Video";
import { getAverageRating } from "../util/averageRating";
import AdvancedRatingPopup from "../component/AdvancedRatingPopup";

const HostedListingCard = (props) => {
    const listing = props.listing;
    const deleteListing = props.deleteListing;
    const unPublishListing = props.unPublishListing;
    const handleOpen = props.handleOpen;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openPopover = (event) => {
      event.stopPropagation();
      event.preventDefault();
      setAnchorEl(anchorEl ? null : event.currentTarget);
    }

    const closePopover = (event) => {
      event.stopPropagation();
      event.preventDefault();
      setAnchorEl(null);
    }

    const nav = useNavigate();
    

    // Default image
    if (!listing.thumbnail) {
        listing.thumbnail =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    }

    return (
        <Card>
            <CardActionArea
                onClick={() => {
                    nav(`/HostedListings/edit/${listing.id.toString()}`);
                }}
            >
                <CardHeader
                    sx={{
                        display: "flex",
                        overflow: "hidden",
                        "& .MuiCardHeader-content": {
                            overflow: "hidden",
                        },
                    }}
                    title={listing.title}
                    titleTypographyProps={{ noWrap: true }}
                    action={
                        <IconButton
                            aria-label="settings"
                            onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                                deleteListing(listing.id);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    }
                />
                {listing.metadata.video ? (
                    <Video url={listing.metadata.video} />
                ) : (
                    <CardMedia
                        component="img"
                        image={listing.thumbnail}
                        alt="Listing thumbnail"
                        sx={{
                            minHeight: "400",
                        }}
                    />
                )}

                <CardContent>
                    <Box
                        justifyContent="space-between"
                        alignItems="center"
                        display="flex"
                    >
                        <Typography>{listing.metadata.propertyType}</Typography>

                        <Button sx={{position: 'relative', left: '9px'}} 
                        onClick={openPopover}
                        onMouseEnter={openPopover}
                        >
                          <Rating
                              size="small"
                              value={getAverageRating(listing.reviews)}
                              precision={0.5}
                              readOnly
                          />
                          <KeyboardArrowDown sx={{fill: 'gray'}}/>
                        </Button>
                        <AdvancedRatingPopup anchorEl={anchorEl} openPopover={openPopover} closePopover={closePopover}/>
                    </Box>
                    <Box
                        justifyContent="space-between"
                        alignItems="center"
                        display="flex"
                    >
                        <Box
                            gap="5px"
                            justifyContent="space-between"
                            alignItems="center"
                            display="flex"
                        >
                            <Typography>
                                {listing.metadata.numBeds}
                                <CribIcon style={{ verticalAlign: "middle" }} />
                            </Typography>
                            <Typography>
                                {listing.metadata.numBaths}
                                <AirlineSeatLegroomNormalIcon
                                    style={{ verticalAlign: "middle" }}
                                />
                            </Typography>
                        </Box>
                        <Typography>
                            {listing.reviews.length} Reviews
                        </Typography>
                    </Box>

                    <Box
                        sx={{ position: "relative", top: "10px" }}
                        justifyContent="space-between"
                        alignItems="center"
                        display="flex"
                    >
                        <Typography sx={{ textDecoration: "underline" }}>
                            <Typography
                                sx={{ fontWeight: "bold" }}
                                display="inline"
                            >
                                ${listing.price} AUD
                            </Typography>
                            &nbsp; per night
                        </Typography>

                        {listing.published ? (
                            <Button
                                onClick={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    unPublishListing(listing.id);
                                }}
                            >
                                Unpublish
                            </Button>
                        ) : (
                            <Button
                                onClick={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    handleOpen(listing.id);
                                    //publishListing(listing.id);
                                }}
                            >
                                publish
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default HostedListingCard;
