

export const getMinPrice = (listings) => {
    if (!listings) {
        return 0;
    }
    let minPrice = Number.MAX_SAFE_INTEGER;
    listings.forEach(l => {
        if (parseInt(l.price) < minPrice) {
            minPrice = parseInt(l.price)
        }
    })
    
    return minPrice;
}

export const getMaxPrice = (listings) => {
    let maxPrice = 0;
    
    listings.forEach(l => {
        if (parseInt(l.price) > maxPrice) {
            maxPrice = parseInt(l.price)
        }
    })

    return maxPrice;
}