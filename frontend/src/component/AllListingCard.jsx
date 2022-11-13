import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CribIcon from "@mui/icons-material/Crib";
import AirlineSeatLegroomNormalIcon from "@mui/icons-material/AirlineSeatLegroomNormal";
import { useNavigate } from "react-router-dom";
import Video from "./Video";
import { getAverageRating } from "../util/averageRating";
import AspectRatio from "@mui/joy/AspectRatio";
const AllListingCard = (props) => {
    const listing = props.listing;
    const dateRange = props.dateRange;
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
                        <Typography>
                            {getAverageRating(listing.reviews)}
                            <StarIcon style={{ verticalAlign: "middle" }} />
                        </Typography>
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
