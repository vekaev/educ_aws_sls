import { StatusEnum } from './auctions.types';

export const getAuctionsSchema = {
    type: 'object',
    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'number',
                    enum: Object.values(StatusEnum),
                },
            },
        },
    },
};

export const createAuctionSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
            },
            required: ['title'],
        },
    },
    required: ['body'],
};

export const updateAuctionSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                picture: {
                    type: 'string',
                    pattern: '^data:image/\\w+;base64,',
                },
                status: {
                    type: 'number',
                    enum: Object.values(StatusEnum),
                },
                highestBid: {
                    type: 'object',
                    properties: {
                        amount: { type: 'number' },
                    },
                    additionalProperties: false,
                },
            },
            additionalProperties: false,
        },
    },
    required: ['body'],
};

export const placeBidSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                amount: { type: 'number' },
            },
            required: ['amount'],
        },
    },
};
