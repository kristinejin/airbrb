import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import CribIcon from "@mui/icons-material/Crib";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import AirlineSeatLegroomNormalIcon from "@mui/icons-material/AirlineSeatLegroomNormal";
import { useNavigate } from "react-router-dom";
import Video from "./Video";
import AdvancedRatingPopup from "../component/AdvancedRatingPopup";
import { getAverageRating } from "../util/averageRating";
import AspectRatio from "@mui/joy/AspectRatio";
const AllListingCard = (props) => {
    const listing = props.listing;
    const dateRange = props.dateRange;
    const [anchorEl, setAnchorEl] = React.useState(null);
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

    const nav = useNavigate();

    const handleSelect = () => {
        nav(`listings/${listing.id}/${dateRange}`);
    };

    return (
        <Card>
            <CardActionArea onClick={() => handleSelect()}>
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
                />
                {listing.metadata.video ? (
                    <AspectRatio>
                        <Video url={listing.metadata.video} />
                    </AspectRatio>
                ) : (
                    <AspectRatio>
                        <CardMedia
                            component="img"
                            image={listing.thumbnail}
                            alt="Listing thumbnail"
                            sx={{
                                minHeight: "400",
                            }}
                        />
                    </AspectRatio>
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
                        <AdvancedRatingPopup anchorEl={anchorEl} openPopover={openPopover} closePopover={closePopover} listing={listing}/>
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
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default AllListingCard;
