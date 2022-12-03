import { v4 as uuid } from 'uuid';
import { StatusCodes } from 'http-status-codes';

import { ddb } from '~libs/ddb';
import { now, responseFactory, middify, verifyParamIdMiddleware, validatorMiddleware } from '~helpers';
import { StatusEnum } from '~constants/auction.constants';
import { unmarshall } from '@aws-sdk/util-dynamodb';

interface Auction {
    id: string;
    title: string;
    status: StatusEnum;
    createdAt: string;
    updatedAt: string;
    highestBid: {
        amount: number;
    };
}

const auctionsDDb = ddb<Auction>(process.env.AUCTIONS_TABLE_NAME!, 'Auction');

export const getAuctions = middify(auctionsDDb.getAll);

export const getAuction = middify((event) => auctionsDDb.getById(event.pathParameters.id)).use(verifyParamIdMiddleware());

const createAuctionDto  = {
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
};

export const createAuction = middify(async (event) => {
    const createdAt = now();
    const auction: Auction = {
        id: uuid(),
        title: event.body.title,
        status: StatusEnum.OPEN,
        createdAt,
        updatedAt: createdAt,
        highestBid: {
            amount: 0,
        },
    };

    await auctionsDDb.create(auction);

    return responseFactory(auction, StatusCodes.CREATED);
}).use(validatorMiddleware(createAuctionDto));

export const updateAuction = middify((event) => {
    const updatedAt = now();

    return auctionsDDb.update(event.pathParameters.id, { updatedAt, ...event.body });
}).use(verifyParamIdMiddleware());

export const deleteAuction = middify(async (event) => {
    const { Attributes } = await auctionsDDb.delete(event.pathParameters.id);

    return responseFactory(unmarshall(Attributes!), StatusCodes.ACCEPTED);
}).use(verifyParamIdMiddleware());
