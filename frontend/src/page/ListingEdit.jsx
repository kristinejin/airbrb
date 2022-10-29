import React from "react";
import { useParams } from "react-router-dom";
import { apiCall } from "../util/api";
import CreateDialog from "../component/CreateDialog";

const ListingEdit = (props) => {
    const listingId = useParams().listingId;
    // display all the listing information 
    let listing;
    apiCall(`listings/${listingId}`, 'GET')
        .then(data => {
            listing = data.listing
            console.log(listing)
        })

    const doEdit = () => {
        console.log('hey')
    }
    return (
        <>
         {() => console.log(listing)}
        <CreateDialog callCreateListing={e => doEdit(e)} listing/>
        </>
    )
}

export default ListingEdit;