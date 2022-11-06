import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid2 from "@mui/material/Unstable_Grid2";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const DatePicker = ({
    dateRange,
    handleOnChangeDateStart,
    handleOnChangeDateEnd,
    availability,
}) => {
    const [start, setStart] = React.useState(dateRange.start);
    const [end, setEnd] = React.useState(dateRange.end);
    const avaiList = [];
    const parseAvailability = () => {
        // push all the available dates?
        availability.forEach((a) => {
            const start = new Date(a.start);
            const end = new Date(a.end);
            while (start <= end) {
                const date = new Date(start);
                avaiList.push(date.toISOString().split("T")[0]);
                start.setDate(date.getDate() + 1);
            }
        });

        return avaiList;
    };
    const getDisabledDates = (date) => {
        const ISODate = date.toISOString().split("T")[0];
        if (!availability) {
            return false;
        }
        const avaiList = parseAvailability();

        if (avaiList.includes(ISODate)) {
            return false;
        }

        return true;
    };

    return (
        <Grid2
            sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                    label="CHECK IN"
                    inputFormat="MM/DD/YYYY"
                    value={start}
                    onChange={(newVal) => {
                        handleOnChangeDateStart(newVal);
                        // compare dates
                        setStart(newVal);
                        if (newVal > end) {
                            setEnd(newVal);
                            handleOnChangeDateEnd(newVal);
                        }
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    shouldDisableDate={(date) => getDisabledDates(date)}
                />
                <Typography> - </Typography>
                <DesktopDatePicker
                    label="CHECK OUT"
                    inputFormat="MM/DD/YYYY"
                    value={end}
                    onChange={(newVal) => {
                        handleOnChangeDateEnd(newVal);
                        setEnd(newVal);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    shouldDisableDate={(date) => getDisabledDates(date)}
                />
            </LocalizationProvider>
        </Grid2>
    );
};

export default DatePicker;
