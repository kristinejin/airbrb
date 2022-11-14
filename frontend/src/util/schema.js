export const listingSchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        address: { type: 'object' },
        propertyType: { type: 'string' },
        price: { type: 'integer' },
        bathrooms: { type: 'integer' },
        amenities: { type: 'string' },
        bedrooms: { type: 'array' },
        thumbnail: { type: 'object' },
    },
    required: [
        'title',
        'address',
        'propertyType',
        'price',
        'bathrooms',
        'amenities',
        'bedrooms',
        'thumbnail',
    ],
    additionalProperties: false,
};

export const addressSchema = {
    type: 'object',
    properties: {
        street: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        postcode: { type: 'integer' },
        country: { type: 'string' },
    },
    required: ['street', 'city', 'state', 'postcode', 'country'],
    additionalProperties: false,
};

export const bedroomSchema = {
    type: 'object',
    properties: {
        roomType: { type: 'string' },
        numBeds: { type: 'integer' },
    },
    required: ['roomType', 'numBeds'],
    additionalProperties: false,
};
