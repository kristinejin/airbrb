import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CustomDatePicker from "./DatePicker";

const FilterDialog = ({ handleClick, open, handleApply, priceInfo }) => {
    const [minBedroom, setMinBedroom] = React.useState(null);
    const [maxBedroom, setMaxBedroom] = React.useState(null);
    const [dateRange, setDateRange] = React.useState({
        start: null,
        end: null,
    });
    const [minPrice, setMinPrice] = React.useState(priceInfo.min);
    const [maxPrice, setMaxPrice] = React.useState(priceInfo.max);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleCleanFilters = () => {
        setDateRange({ start: null, end: null });

        handleApply({ isClean: true });
    };

    const handleOnChangeDateStart = (newDate) => {
        const curr = dateRange;
        curr.start = newDate;
        setDateRange(curr);
    };

    const handleOnChangeDateEnd = (newDate) => {
        const curr = dateRange;
        curr.end = newDate;
        setDateRange(curr);
    };

    if (!open) {
        return null;
    }

    const cleanData = () => {
        const bedroom = {
            isFilter: false,
        };
        if (minBedroom && maxBedroom) {
            bedroom.isFilter = true;
            bedroom.min = minBedroom;
            bedroom.max = maxBedroom;
        }

        const date = {
            isFilter: false,
        };
        if (dateRange.start && dateRange.end) {
            date.isFilter = true;
            date.dateRange = dateRange;
        }

        const price = {
            isFilter: false,
        };

        if (
            parseInt(minPrice) !== parseInt(priceInfo.min) ||
            parseInt(maxPrice) !== parseInt(priceInfo.max)
        ) {
            price.isFilter = true;
            price.min = parseInt(minPrice);
            price.max = parseInt(maxPrice);
        }

        handleApply({ bedroom: bedroom, date: date, price: price });
    };
    const minDistance = 10;
    const handlePriceChange = (e, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setMinPrice(Math.min(newValue[0], maxPrice - minDistance));
            setMaxPrice(maxPrice);
            // setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
        } else {
            setMinPrice(minPrice);
            setMaxPrice(Math.max(newValue[1], minPrice + minDistance));
            // setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
        }
    };

    return (
        <Dialog
            // sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            // maxWidth="xs"
            fullScreen={fullScreen}
            // TransitionProps={{ onEntering: handleClick }}
            open={open}
        >
            <DialogTitle>Filters</DialogTitle>
            <DialogContent dividers>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Divider>Date Range</Divider>
                    <Grid2 container>
                        <Grid2 xs={12}>
                            <CustomDatePicker
                                dateRange={dateRange}
                                handleOnChangeDateStart={
                                    handleOnChangeDateStart
                                }
                                handleOnChangeDateEnd={handleOnChangeDateEnd}
                            />
                        </Grid2>
                    </Grid2>
                    <Divider>Bedrooms</Divider>
                    <Grid2 container spacing={1.8}>
                        <Grid2 xs={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Min"
                                onChange={(e) => setMinBedroom(e.target.value)}
                            />
                        </Grid2>
                        <Grid2 xs={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Max"
                                onChange={(e) => setMaxBedroom(e.target.value)}
                            />
                        </Grid2>
                    </Grid2>
                    <Divider>Price Range</Divider>
                    <Grid2 xs={12}>
                        <Slider
                            getAriaLabel={() => "Minimum distance"}
                            value={[minPrice, maxPrice]}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            max={priceInfo.max}
                            min={priceInfo.min}
                            disableSwap
                        />
                    </Grid2>
                    <Divider />
                    <Button onClick={handleCleanFilters}>Clean Filters</Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClick}>
                    Cancel
                </Button>
                <Button onClick={cleanData}>Apply</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FilterDialog;
