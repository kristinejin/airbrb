import React from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material//Paper';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TablePagination from '@mui/material/TablePagination';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';

import HomeIcon from '@mui/icons-material/Home';
import { withStyles } from '@mui/styles';

import SideMenu from '../component/SideMenu';

import { apiCall } from '../util/api';

import { useParams } from 'react-router-dom';

const styles = (theme) => ({});

const BookingHistory = (props) => {
    const params = useParams();
    const listingId = params.id;
    const [pastBookings, setPastBookings] = React.useState('');
    const [bookings, setBookings] = React.useState('');
    const [listingInfo, setListingInfo] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [bookingPage, setBookingPage] = React.useState(0);
    const [rowsPerBookingPage, setRowsPerBookingPage] = React.useState(5);
    const [pastBookingPage, setPastBookingPage] = React.useState(0);
    const [rowsPerPastBookingPage, setRowsPerPastBookingPage] =
        React.useState(5);

    const getBookings = () => {
        apiCall('bookings', 'GET').then((data) => {
            const presentBookings = [];
            const previousBookings = [];
            data.bookings.forEach((booking) => {
                if (booking.listingId === listingId) {
                    if (booking.status !== 'pending') {
                        previousBookings.push(booking);
                    } else {
                        presentBookings.push(booking);
                    }
                }
            });
            setBookings(presentBookings);
            setPastBookings(previousBookings);
        });
    };

    const getListingInfo = () => {
        apiCall(`listings/${listingId}`, 'GET').then((data) => {
            setListingInfo(data.listing);
        });
    };

    const calcTotalProfit = () => {
        let totalProfit = 0;
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        pastBookings.forEach((pastBooking) => {
            const startDate = new Date(pastBooking.dateRange.startdate);
            if (pastBooking.status === 'accepted' && startDate >= lastYear) {
                totalProfit += pastBooking.totalPrice;
            }
        });
        return totalProfit;
    };

    const calcTotalDaysBooked = () => {
        let totalDaysBooked = 0;
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        pastBookings.forEach((pastBooking) => {
            const startDate = new Date(pastBooking.dateRange.startdate);
            if (pastBooking.status === 'accepted' && startDate >= lastYear) {
                const endDate = new Date(pastBooking.dateRange.enddate);
                const daysBooked =
                    (endDate.getTime() - startDate.getTime()) /
                    (1000 * 3600 * 24);
                totalDaysBooked += daysBooked;
            }
        });
        return totalDaysBooked;
    };

    const turnIntoDate = (isoString) => {
        return isoString.replace(/T.*/, '').split('-').reverse().join('-');
    };

    const totalDaysOnline = () => {
        const postedOn = listingInfo.postedOn;
        if (!postedOn) {
            return 0;
        }
        const dateNow = new Date();
        const postedOnDate = new Date(postedOn);
        const totalDays = Math.ceil(
            (dateNow - postedOnDate) / (1000 * 3600 * 24)
        );
        return totalDays;
    };

    const handleChangeBookingPage = (e, newPage) => {
        setBookingPage(newPage);
    };

    const handleChangeRowsPerBookingPage = (e) => {
        setRowsPerBookingPage(parseInt(e.target.value, 10));
        setBookingPage(0);
    };

    const handleChangePastBookingPage = (e, newPage) => {
        setPastBookingPage(newPage);
    };

    const handleChangeRowsPerPastBookingPage = (e) => {
        setRowsPerPastBookingPage(parseInt(e.target.value, 10));
        setPastBookingPage(0);
    };

    const handleBookingStatus = (bookingId, act) => {
        apiCall(`bookings/${act}/${bookingId}`, 'PUT').then(() => {
            const currentBookings = [...bookings];
            const getIndex = currentBookings.findIndex(
                (obj) => obj.id === bookingId
            );

            const currentPastBookings = [...pastBookings];
            const selectedBooking = { ...currentBookings[getIndex] };
            if (act === 'accept') {
                selectedBooking.status = 'accepted';
            } else {
                selectedBooking.status = 'declined';
            }
            currentPastBookings.push(selectedBooking);

            setBookings((current) =>
                current.filter(
                    (currentBooking) => currentBooking.id !== bookingId
                )
            );
            setPastBookings(currentPastBookings);
        });
    };

    React.useEffect(() => {
        getBookings();
        getListingInfo();
    }, []);

    const emptyRowsPerBookingPage =
        rowsPerBookingPage -
        Math.min(
            rowsPerBookingPage,
            bookings.length - bookingPage * rowsPerBookingPage
        );
    const emptyRowsPerPastBookingPage =
        rowsPerPastBookingPage -
        Math.min(
            rowsPerPastBookingPage,
            pastBookings.length - pastBookingPage * rowsPerPastBookingPage
        );
    if (!bookings || !listingInfo || !pastBookings) {
        return <>Loading...</>;
    }

    return (
        <Box>
            <Box
                sx={{ border: '1px solid rgb(230, 230, 230)', padding: '30px' }}
                justifyContent="space-between"
                alignItems="center"
                display="flex"
            >
                <Box sx={{ flex: '0.5' }}>
                    <Button
                        sx={{ fontSize: '20px' }}
                        onClick={() => {
                            window.location.href = '/';
                        }}
                    >
                        <HomeIcon
                            sx={{
                                height: '30px',
                                width: '30px',
                                verticalAlign: 'middle',
                            }}
                        />
                        Go Home
                    </Button>
                </Box>
                <Typography
                    sx={{ flex: '2', textAlign: 'center' }}
                    component="h1"
                    variant="h4"
                >
                    Bookings and Statistics
                </Typography>
                <Box sx={{ flex: '0.5' }}>
                    <SideMenu />
                </Box>
            </Box>
            <Box sx={{ padding: '40px' }}>
                <Typography component="h1" variant="h5">
                    Your listing statistics
                </Typography>
                <Grid container rowSpacing={3} columnSpacing={3}>
                    <Grid item xs={12} sm={6} md={4} key={'listingOnline'}>
                        <Card sx={{ textAlign: 'center' }}>
                            <CardHeader
                                title="Total Days Online"
                                titleTypographyProps={{ variant: 'h7' }}
                            />
                            <CardContent>
                                <Typography component="h2" variant="h7">
                                    {totalDaysOnline()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} key={'listingBookedDays'}>
                        <Card sx={{ textAlign: 'center' }}>
                            <CardHeader
                                title="Total Days Booked"
                                titleTypographyProps={{ variant: 'h7' }}
                                totalDaysOnline
                            />
                            <CardContent>
                                <Typography component="h2" variant="h7">
                                    {calcTotalDaysBooked()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} key={'listingProfit'}>
                        <Card sx={{ textAlign: 'center' }}>
                            <CardHeader
                                title="Total Profit"
                                titleTypographyProps={{ variant: 'h7' }}
                            />
                            <CardContent>
                                <Typography component="h2" variant="h7">
                                    ${calcTotalProfit()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <TableContainer sx={{ marginTop: '50px' }} component={Paper}>
                    <Table aria-label="pastBookingTable">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <IconButton
                                        aria-label="expandRow"
                                        size="small"
                                        onClick={() => setOpen(!open)}
                                    >
                                        {open
                                            ? (
                                                <KeyboardArrowUp />
                                            )
                                            : (
                                                <KeyboardArrowDown />
                                            )}
                                    </IconButton>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        textAlign: 'center',
                                        fontSize: '18px',
                                    }}
                                    component="th"
                                    scope="row"
                                >
                                    View Past Bookings
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        sx={{ float: 'right' }}
                                        aria-label="expandRow"
                                        size="small"
                                        onClick={() => setOpen(!open)}
                                    >
                                        {open
                                            ? (
                                                <KeyboardArrowUp />
                                            )
                                            : (
                                                <KeyboardArrowDown />
                                            )}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            <TableRow>
                                <TableCell
                                    sx={{ paddingBottom: 0, paddingTop: 0 }}
                                    colSpan={6}
                                >
                                    <Collapse
                                        in={open}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        sx={{
                                                            display: {
                                                                sm: 'none',
                                                                md: 'table-cell',
                                                            },
                                                        }}
                                                    >
                                                        Requester
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            display: {
                                                                xs: 'none',
                                                                sm: 'table-cell',
                                                            },
                                                        }}
                                                        align="right"
                                                    >
                                                        Start Date
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            display: {
                                                                xs: 'none',
                                                                sm: 'table-cell',
                                                            },
                                                        }}
                                                        align="right"
                                                    >
                                                        End Date
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        Price
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        Status
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pastBookings
                                                    .slice(
                                                        pastBookingPage *
                                                            rowsPerPastBookingPage,
                                                        pastBookingPage *
                                                            rowsPerPastBookingPage +
                                                            rowsPerPastBookingPage
                                                    )
                                                    .map((row) => (
                                                        <TableRow key={row.id}>
                                                            <TableCell
                                                                sx={{
                                                                    display: {
                                                                        sm: 'none',
                                                                        md: 'table-cell',
                                                                    },
                                                                }}
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {row.owner}
                                                            </TableCell>
                                                            <TableCell
                                                                sx={{
                                                                    display: {
                                                                        xs: 'none',
                                                                        sm: 'table-cell',
                                                                    },
                                                                }}
                                                                align="right"
                                                            >
                                                                {turnIntoDate(
                                                                    row
                                                                        .dateRange
                                                                        .startdate
                                                                )}
                                                            </TableCell>
                                                            <TableCell
                                                                sx={{
                                                                    display: {
                                                                        xs: 'none',
                                                                        sm: 'table-cell',
                                                                    },
                                                                }}
                                                                align="right"
                                                            >
                                                                {turnIntoDate(
                                                                    row
                                                                        .dateRange
                                                                        .enddate
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {row.totalPrice}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {row.status}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                {pastBookingPage !== 0 &&
                                                    emptyRowsPerPastBookingPage >
                                                        0 && (
                                                    <TableRow
                                                        sx={{
                                                            height:
                                                                    53 *
                                                                    emptyRowsPerPastBookingPage,
                                                        }}
                                                    >
                                                        <TableCell
                                                            colSpan={6}
                                                        />
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={pastBookings.length}
                                            page={pastBookingPage}
                                            onPageChange={
                                                handleChangePastBookingPage
                                            }
                                            rowsPerPage={rowsPerPastBookingPage}
                                            onRowsPerPageChange={
                                                handleChangeRowsPerPastBookingPage
                                            }
                                        />
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ padding: '40px' }}>
                <Typography component="h1" variant="h5">
                    Current Bookings for this listing
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="bookingTable">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        display: {
                                            sm: 'none',
                                            md: 'table-cell',
                                        },
                                    }}
                                >
                                    Requester
                                </TableCell>
                                <TableCell
                                    sx={{
                                        display: {
                                            xs: 'none',
                                            sm: 'table-cell',
                                        },
                                    }}
                                    align="right"
                                >
                                    Start Date
                                </TableCell>
                                <TableCell
                                    sx={{
                                        display: {
                                            xs: 'none',
                                            sm: 'table-cell',
                                        },
                                    }}
                                    align="right"
                                >
                                    End Date
                                </TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Accept/Deny</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings
                                .slice(
                                    bookingPage * rowsPerBookingPage,
                                    bookingPage * rowsPerBookingPage +
                                        rowsPerBookingPage
                                )
                                .map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell
                                            sx={{
                                                display: {
                                                    sm: 'none',
                                                    md: 'table-cell',
                                                },
                                            }}
                                            component="th"
                                            scope="row"
                                        >
                                            {row.owner}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                display: {
                                                    xs: 'none',
                                                    sm: 'table-cell',
                                                },
                                            }}
                                            align="right"
                                        >
                                            {turnIntoDate(
                                                row.dateRange.startdate
                                            )}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                display: {
                                                    xs: 'none',
                                                    sm: 'table-cell',
                                                },
                                            }}
                                            align="right"
                                        >
                                            {turnIntoDate(
                                                row.dateRange.enddate
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.totalPrice}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                color="success"
                                                onClick={() =>
                                                    handleBookingStatus(
                                                        row.id,
                                                        'accept'
                                                    )
                                                }
                                            >
                                                Accept
                                            </Button>
                                            <span>/</span>
                                            <Button
                                                color="warning"
                                                onClick={() =>
                                                    handleBookingStatus(
                                                        row.id,
                                                        'decline'
                                                    )
                                                }
                                            >
                                                Deny
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            {bookingPage !== 0 && emptyRowsPerBookingPage > 0 && (
                                <TableRow
                                    sx={{
                                        height: 69.5 * emptyRowsPerBookingPage,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={bookings.length}
                        page={bookingPage}
                        onPageChange={handleChangeBookingPage}
                        rowsPerPage={rowsPerBookingPage}
                        onRowsPerPageChange={handleChangeRowsPerBookingPage}
                    />
                </TableContainer>
            </Box>
        </Box>
    );
};

export default withStyles(styles)(BookingHistory);
