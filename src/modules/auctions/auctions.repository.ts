import { marshall } from '@aws-sdk/util-dynamodb';

import { ddb } from '@/libs/ddb';

import { Auction, StatusEnum } from './auctions.types';

const AUCTION_ITEM_NAME = 'Auction';
const auctionsDDb = ddb<Auction>(
    process.env.AUCTIONS_TABLE_NAME!,
    AUCTION_ITEM_NAME,
);

export const AuctionsRepository = {
    ...auctionsDDb,

    getAuctionsByStatus: (status: StatusEnum) => {
        return AuctionsRepository.queryAll({
            IndexName: 'statusAndEndDate',
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeValues: marshall({
                ':status': status,
            }),
            ExpressionAttributeNames: {
                '#status': 'status',
            },
        });
    },

    getEndedAuctions: () => {
        const now = new Date().toISOString();

        return AuctionsRepository.queryAll({
            IndexName: 'statusAndEndDate',
            KeyConditionExpression: '#status = :status AND endingAt <= :now',
            ExpressionAttributeValues: marshall({
                ':status': StatusEnum.OPEN,
                ':now': now,
            }),
            ExpressionAttributeNames: {
                '#status': 'status',
            },
        });
    },
};
