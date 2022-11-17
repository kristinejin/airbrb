import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import TuneIcon from '@mui/icons-material/Tune'
import Grid2 from '@mui/material/Unstable_Grid2'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { withStyles } from '@mui/styles'

import AllListingCard from '../component/AllListingCard'
import { SideMenu } from '../component/SideMenu'
import SearchIcon from '@mui/icons-material/Search'
import { apiCall } from '../util/api'
import Chip from '@mui/material/Chip'
import FilterDialog from '../component/FilterDialog'
import { getMinPrice, getMaxPrice } from '../util/priceData'
import { getAverageRating } from '../util/averageRating'
// import { isMobileWidth } from '../util/screen'

const styles = (theme) => ({
  searchBox: {
    flex: '1',
    width: '100%',
    border: '1px solid black',
  },
})

const LandingPage = (props) => {
  const userEmail = localStorage.getItem('email')
  const [bookedListings, setBookedListings] = React.useState('')
  const [listings, setListings] = React.useState('')
  const [priceRange, setPriceRange] = React.useState({ min: 0, max: 0 })
  const [searchStr, setSearchStr] = React.useState('')
  const [showFilters, setShowFileters] = React.useState(false)
  const [appliedDate, setAppliedDate] = React.useState(false)
  const [dateRange, setDateRange] = React.useState(false)
  const [sort, setSort] = React.useState('Most Relevant')

  const sortListings = (listingArray) => {
    const compare = (a, b) => {
      if (a.title < b.title) {
        return -1
      } else if (a.title > b.title) {
        return 1
      } else {
        return 0
      }
    }
    listingArray.sort(compare)
  }

  const putBookedListingsFirst = (listingArray) => {
    if (!userEmail) {
      setListings(listingArray)
      setBookedListings([])
      return {}
    }

    apiCall('bookings', 'GET').then((data) => {
      const bookedListingIds = []
      data.bookings.forEach((booking) => {
        if (booking.owner === userEmail) {
          bookedListingIds.push(booking.listingId)
        }
      })

      const allBookedListings = []
      listingArray.forEach((listing) => {
        if (bookedListingIds.includes(listing.id.toString())) {
          allBookedListings.push(listing)
        }
      })

      bookedListingIds.forEach((listingId) => {
        listingArray = listingArray.filter(
          (listing) => listing.id.toString() !== listingId
        )
      })

      setBookedListings(allBookedListings)
      setListings(listingArray)
    })
  }

  const getListings = () => {
    apiCall('listings', 'GET').then((data) => {
      const minPrice = getMinPrice(data.listings)
      const maxPrice = getMaxPrice(data.listings)
      setPriceRange({ min: minPrice, max: maxPrice })

      const AllListingsPromises = []
      const allListingsIds = []
      data.listings.forEach((listing) => {
        AllListingsPromises.push(apiCall(`listings/${listing.id}`, 'GET'))
        allListingsIds.push(listing.id)
      })

      const responses = Promise.all(AllListingsPromises)
      responses.then((response) => {
        const allListings = []
        let i = 0
        response.forEach((listing) => {
          if (listing.listing.published) {
            listing.listing.id = allListingsIds[i]
            allListings.push(listing.listing)
          }
          i += 1
        })

        sortListings(allListings)
        putBookedListingsFirst(allListings)
      })
    })
  }

  const searchAction = async () => {
    const wordsList = searchStr.toLowerCase().split(' ')
    const newL = [...listings, ...bookedListings]
    const filteredListings = newL.filter((l) => {
      return (
        wordsList.some((w) => l.title.toLowerCase().includes(w)) ||
        wordsList.some((w) => l.address.city.toLowerCase().includes(w))
      )
    })
    putBookedListingsFirst(filteredListings)
  }

  const handleSearchStrUpdate = (e) => {
    setSearchStr(e.target.value)
  }

  const handleClickFilters = () => {
    setShowFileters(!showFilters)
  }

  const filterNumBedrooms = (min, max, listingData) => {
    const filteredListings = listingData.filter((l) => {
      return (
        parseInt(l.metadata.numBeds) <= parseInt(max) &&
        parseInt(l.metadata.numBeds) >= parseInt(min)
      )
    })
    return filteredListings
  }

  const checkDates = (avai, dateRange) => {
    const avaiDate = {
      start: new Date(avai.start),
      end: new Date(avai.end),
    }
    return (
      avaiDate.start.getTime() <= dateRange.start.valueOf() &&
      avaiDate.end.getTime() >= dateRange.end.valueOf()
    )
  }

  const filterDate = (dateRange, listingData) => {
    const filteredListings = listingData.filter((l) => {
      const avai = l.availability
      return avai.some((a) => checkDates(a, dateRange))
    })

    const dateDiff = dateRange.start.diff(dateRange.end, 'day') === 0
    setDateRange(dateDiff ? 1 : dateDiff)
    setAppliedDate(true)
    return filteredListings
  }

  const filterPrice = (min, max, listingData) => {
    const filteredListings = listingData.filter((l) => {
      return parseInt(l.price) >= min && parseInt(l.price) <= max
    })

    return filteredListings
  }

  const handleApplyFilters = async ({ bedroom, date, price, isClean }) => {
    if (isClean) {
      getListings()
      handleClickFilters()
      return null
    }

    const newL = [...listings, ...bookedListings]

    // setListings(finalListingInfo);
    let filteredListings = newL
    if (bedroom.isFilter) {
      filteredListings = filterNumBedrooms(
        bedroom.min,
        bedroom.max,
        filteredListings
      )
    }

    if (date.isFilter) {
      // apply num bed filters
      filteredListings = filterDate(date.dateRange, filteredListings)
    }
    if (price.isFilter) {
      filteredListings = filterPrice(price.min, price.max, filteredListings)
    }

    putBookedListingsFirst(filteredListings)
    handleClickFilters()
  }

  const sortListingDesc = (list) => {
    // sort high low
    const compare = (a, b) => {
      const averageA = getAverageRating(a.reviews)
      const averageB = getAverageRating(b.reviews)
      if (averageA > averageB) {
        return -1
      } else if (averageA < averageB) {
        return 1
      } else {
        return 0
      }
    }
    list.sort(compare)
  }

  const sortListingAsc = (list) => {
    // sort high low
    // console.log(list);

    const compare = (a, b) => {
      const averageA = getAverageRating(a.reviews)
      const averageB = getAverageRating(b.reviews)
      if (averageA < averageB) {
        return -1
      } else if (averageA > averageB) {
        return 1
      } else {
        return 0
      }
    }
    list.sort(compare)
  }

  const handleApplySort = (e) => {
    const newSort = e.target.value
    const newL = [...listings, ...bookedListings]
    if (newSort === 'Most Relevant') {
      sortListings(newL)
    } else if (newSort === 'Rating DESC') {
      sortListingDesc(newL)
    } else if (newSort === 'Rating ASC') {
      sortListingAsc(newL)
    }
    putBookedListingsFirst(newL)
    setSort(e.target.value)
  }

  React.useEffect(() => {
    getListings()
  }, [])

  if (!listings || !bookedListings) {
    return <>Loading...</>
  }

  return (
    <Box>
      <Box
        sx={{ border: '1px solid rgb(230, 230, 230)', padding: '30px' }}
        justifyContent="space-between"
        alignItems="center"
        display="flex"
      >
        <Typography
          sx={{
            flex: '1',
            cursor: 'pointer',
            display: { xs: 'none', sm: 'block', md: 'block' },
          }}
          component="h1"
          variant="h4"
          onClick={() => {
            getListings()
          }}
        >
          airbrb
        </Typography>
        <Grid2>
          <TextField
            fullWidth
            placeholder="Search..."
            size="small"
            sx={{
              minWidth: '30vw',
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
        </Grid2>
        <Box sx={{ flex: '1' }}>
          <SideMenu />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px 20px 40px',
        }}
      >
        <IconButton
          type="button"
          aria-label="return to all listings"
          onClick={() => {
            getListings()
          }}
        >
          <ArrowBackIcon />
          <Typography
            variant="body2"
            sx={{ display: { xs: 'none', sm: 'block', md: 'block' } }}
          >
            All listings
          </Typography>
        </IconButton>
        <Box>
          <Chip
            label="Filters"
            size="lg"
            onClick={handleClickFilters}
            sx={{
              m: 0.5,
            }}
            // TuneIcon
            icon={<TuneIcon fontSize="small" />}
          >
            Filters
          </Chip>
          <FilterDialog
            open={showFilters}
            handleClick={handleClickFilters}
            handleApply={handleApplyFilters}
            priceInfo={priceRange}
          />
          <FormControl sx={{ ml: 1, maxWidth: 170 }} size="small">
            <Select
              sx={{ maxWidth: 160 }}
              labelId="demo-select-small"
              id="demo-select-small"
              value={sort}
              onChange={handleApplySort}
            >
              <MenuItem value={'Most Relevant'}>Most relevant</MenuItem>
              <MenuItem value={'Rating DESC'}>
                Rating (Highest - Lowest)
              </MenuItem>
              <MenuItem value={'Rating ASC'}>
                Rating (Lowest - Highest)
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ padding: '10px 40px 40px 40px' }}>
        {bookedListings.length !== 0 && (
          <Typography component="h1" variant="h5">
            Your booked listings
          </Typography>
        )}
        <Grid
          container
          rowSpacing={3}
          columnSpacing={3}
          sx={{ paddingBottom: '30px' }}
        >
          {bookedListings.map((data) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={data.id}>
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
        <Grid
          container
          rowSpacing={3}
          columnSpacing={3}
          direction="row"
          alignItems="stretch"
        >
          {listings.map((data) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={data.id}>
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
  )
}

export default withStyles(styles)(LandingPage)
