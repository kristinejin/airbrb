import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TuneIcon from "@mui/icons-material/Tune";

import { withStyles } from "@mui/styles";

import AllListingCard from "../component/AllListingCard";
import SideMenu from "../component/SideMenu";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../util/api";
import Chip from "@mui/material/Chip";
import FilterDialog from "../component/FilterDialog";
import { getMinPrice, getMaxPrice } from "../util/priceData";

const styles = (theme) => ({
    searchBox: {
        flex: "1",
        width: "100%",
        border: "1px solid black",
    },
});

const LandingPage = (props) => {
    const user_email = localStorage.getItem("email");
    const [bookedListings, setBookedListings] = React.useState("");
    const [listings, setListings] = React.useState("");
    const [priceRange, setPriceRange] = React.useState({ min: 0, max: 0 });
    const [searchStr, setSearchStr] = React.useState("");
    const [showFilters, setShowFileters] = React.useState(false);
    const [appliedDate, setAppliedDate] = React.useState(false);
    const [dateRange, setDateRange] = React.useState(false);
    const [sort, setSort] = React.useState("Most Relevant");
    const nav = useNavigate();

    const sortListings = (listingArray) => {
        const compare = (a, b) => {
            if (a.title < b.title) {
                return -1;
            } else if (a.title > b.title) {
                return 1;
            } else {
                return 0;
            }
        };
        listingArray.sort(compare);
    };

    const putBookedListingsFirst = (listingArray) => {
        if (!user_email) {
            setListings(listingArray);
            setBookedListings([]);
            return {};
        }

        apiCall("bookings", "GET").then((data) => {
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
                listingArray = listingArray.filter(
                    (listing) => listing.id.toString() !== listingId
                );
            });

            setBookedListings(allBookedListings);
            setListings(listingArray);
        });
    };

    const getListings = () => {
        apiCall("listings", "GET").then((data) => {
            const minPrice = getMinPrice(data.listings);
            const maxPrice = getMaxPrice(data.listings);
            setPriceRange({ min: minPrice, max: maxPrice });

            let AllListingsPromises = [];
            let allListingsIds = [];
            data.listings.forEach((listing) => {
                AllListingsPromises.push(
                    apiCall(`listings/${listing.id}`, "GET")
                );
                allListingsIds.push(listing.id);
            });

            const responses = Promise.all(AllListingsPromises);
            responses.then((response) => {
                let allListings = [];
                let i = 0;
                response.forEach((listing) => {
                    if (listing.listing.published) {
                        listing.listing.id = allListingsIds[i];
                        allListings.push(listing.listing);
                    }
                    i += 1;
                });

                sortListings(allListings);
                putBookedListingsFirst(allListings);
            });
        });
    };

    const pushListings = async (data) => {
        let AllListingsPromises = [];
        let allListingsIds = [];
        data.forEach((listing) => {
            AllListingsPromises.push(apiCall(`listings/${listing.id}`, "GET"));
            allListingsIds.push(listing.id);
        });
        const responses = await Promise.all(AllListingsPromises);
        let allListings = [];
        let i = 0;
        responses.forEach((listing) => {
            if (listing.listing.published) {
                listing.listing.id = allListingsIds[i];
                allListings.push(listing.listing);
            }
            i += 1;
        });

        sortListings(allListings);
        putBookedListingsFirst(allListings);
    };

    const searchAction = async () => {
        const resp = await apiCall("listings", "GET");
        const listings = resp.listings;
        const wordsList = searchStr.toLowerCase().split(" ");

        const filteredListings = listings.filter((l) => {
            return (
                wordsList.some((w) => l.title.toLowerCase().includes(w)) ||
                wordsList.some((w) => l.address.city.toLowerCase().includes(w))
            );
        });
        pushListings(filteredListings);
    };

    const handleSearchStrUpdate = (e) => {
        setSearchStr(e.target.value);
    };

    const handleClickFilters = () => {
        setShowFileters(showFilters ? false : true);
    };

    const addIdToListing = (listings, ids) => {
        const listingList = [];
        for (const [i, l] of listings.entries()) {
            l.listing.id = ids[i];
            listingList.push(l.listing);
        }
        return listingList;
    };

    const filterNumBedrooms = (min, max, listingData) => {
        const filteredListings = listingData.filter((l) => {
            return (
                parseInt(l.metadata.numBeds) <= parseInt(max) &&
                parseInt(l.metadata.numBeds) >= parseInt(min)
            );
        });
        return filteredListings;
    };

    const checkDates = (avai, dateRange) => {
        const avaiDate = {
            start: new Date(avai.start),
            end: new Date(avai.end),
        };
        return (
            avaiDate.start.getTime() <= dateRange.start.valueOf() &&
            avaiDate.end.getTime() >= dateRange.end.valueOf()
        );
    };

    const filterDate = (dateRange, listingData) => {
        const filteredListings = listingData.filter((l) => {
            const avai = l.availability;
            return avai.some((a) => checkDates(a, dateRange));
        });

        setDateRange(dateRange.start.diff(dateRange.end, "day"));
        setAppliedDate(true);
        return filteredListings;
    };

    const filterPrice = (min, max, listingData) => {
        const filteredListings = listingData.filter((l) => {
            return parseInt(l.price) >= min && parseInt(l.price) <= max;
        });

        return filteredListings;
    };

    const handleApplyFilters = async ({ bedroom, date, price, isClean }) => {
        if (isClean) {
            getListings();
            handleClickFilters();
            return null;
        }

        const resp = await apiCall("listings", "GET");
        const promises = [];
        const ids = [];
        const getListingDets = async (id) => {
            const listing = await apiCall(`listings/${id}`, "GET");
            return listing;
        };
        resp.listings.forEach((l) => {
            promises.push(getListingDets(l.id));
            ids.push(l.id);
        });

        const listingData = await Promise.all(promises);
        const finalListingInfo = addIdToListing(listingData, ids);

        // setListings(finalListingInfo);
        let filteredListings = null;
        let applied = false;
        if (bedroom.isFilter) {
            filteredListings = filterNumBedrooms(
                bedroom.min,
                bedroom.max,
                finalListingInfo
            );
            applied = true;
        }

        if (date.isFilter) {
            // apply num bed filters
            filteredListings = filterDate(
                date.dateRange,
                filteredListings ? filteredListings : finalListingInfo
            );
            applied = true;
        }
        if (price.isFilter) {
            filteredListings = filterPrice(
                price.min,
                price.max,
                filteredListings ? filteredListings : finalListingInfo
            );
            applied = true;
        }

        if (applied) {
            setBookedListings([]);
        }

        sortListings(filteredListings);
        setListings(filteredListings);
        handleClickFilters();
    };

    const handleApplySort = (e) => {
        const newSort = e.target.value;
        if (newSort === "Most Relevant") {
        } else if (newSort === "Rating DESC") {
        } else if (newSort === "Rating ASC") {
        }
        setSort(e.target.value);
    };

    React.useEffect(() => {
        getListings();
    }, []);

    if (!listings || !bookedListings) {
        return <>Loading...</>;
    }

    const { classes } = props;
    return (
        <Box>
            <Box
                sx={{ border: "1px solid rgb(230, 230, 230)", padding: "30px" }}
                justifyContent="space-between"
                alignItems="center"
                display="flex"
            >
                <Typography
                    sx={{
                        flex: "1",
                        cursor: "pointer",
                    }}
                    component="h1"
                    variant="h4"
                    onClick={() => nav("/")}
                >
                    airbrb
                </Typography>
                <TextField
                    placeholder="Search..."
                    size="small"
                    sx={{
                        width: "30vw",
                    }}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                type="button"
                                aria-label="search"
                                onClick={searchAction}
                            >
                                <SearchIcon />
                            </IconButton>
                        ),
                    }}
                    onChange={handleSearchStrUpdate}
                ></TextField>

                <Chip
                    label="Filters"
                    onClick={handleClickFilters}
                    sx={{
                        ml: 1,
                    }}
                    // TuneIcon
                    icon={<TuneIcon fontSize="small" />}
                />

                <FilterDialog
                    open={showFilters}
                    handleClick={handleClickFilters}
                    handleApply={handleApplyFilters}
                    priceInfo={priceRange}
                />

                {/* 
                    2. Review Ratings
                        - Sort from height - lowerest and vice versa
                        - Order don't matter for the same rated listings
                */}

                <FormControl sx={{ ml: 1, maxWidth: 170 }} size="small">
                    <Select
                        sx={{ maxWidth: 170 }}
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={sort}
                        onChange={handleApplySort}
                    >
                        <MenuItem value={"Most Relevant"}>
                            Most Relevant
                        </MenuItem>
                        <MenuItem value={"Rating DESC"}>
                            Rating - Highest to Lowest
                        </MenuItem>
                        <MenuItem value={"Rating ASC"}>
                            Rating - Lowest to Highest
                        </MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ flex: "1" }}>
                    <SideMenu />
                </Box>
            </Box>
            <Box sx={{ padding: "40px" }}>
                {bookedListings.length !== 0 && (
                    <Typography component="h1" variant="h5">
                        Your booked listings
                    </Typography>
                )}
                <Grid
                    container
                    rowSpacing={3}
                    columnSpacing={3}
                    sx={{ paddingBottom: "30px" }}
                >
                    {bookedListings.map((data) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            xl={2.4}
                            key={data.id}
                        >
                            <AllListingCard
                                listing={data}
                                isDate={appliedDate}
                                dateRange={dateRange}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Typography component="h1" variant="h5">
                    All hosted listings
                </Typography>
                <Grid container rowSpacing={3} columnSpacing={3}>
                    {listings.map((data) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            xl={2.4}
                            key={data.id}
                        >
                            <AllListingCard
                                listing={data}
                                isDate={appliedDate}
                                dateRange={dateRange}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default withStyles(styles)(LandingPage);
