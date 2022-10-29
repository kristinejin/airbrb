import React from "react";
import { useParams } from "react-router-dom";
import { apiCall } from "../util/api";
import CreateDialog from "../component/CreateDialog";
import config from '../config';
import { useState } from "react";
import { useEffect } from "react";


const ListingEdit = (props) => {
    const listingId = useParams().listingId;
    const [listing, setListing] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    // // display all the listing information 
    const getListing = async () => {
        const resp = await apiCall(`listings/${listingId}`, 'GET');
        return resp;
    }

    useEffect(() => {
        getListing()
            .then((data) => {
                setListing(data.listing)
                setIsLoaded(true)
            })
            .catch((data) => {
                setIsLoaded(false);
                alert(data)
            })
    }, [])

    const doEdit = () => {
        // request to edit
        // go back to hosted listing page
        // update, show all the new info
    }

    return (
        <>
            {!isLoaded && <p>loading...</p>}
            {isLoaded && <CreateDialog callCreateListing={e => doEdit(e)} listingInfo={listing}/>}
            {/* thumbnail */}
            {/* list of images */}
        </>
    )
}

export default ListingEdit;