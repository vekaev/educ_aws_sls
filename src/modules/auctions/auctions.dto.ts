import { StatusEnum } from './auctions.types';

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
