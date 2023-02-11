import { v4 as uuid } from 'uuid';
import createError from 'http-errors';
import addHours from 'date-fns/addHours';
import { StatusCodes } from 'http-status-codes';

import { sqs } from '@/libs/sqs';
import { SendEmailDto } from '@/modules/notification';

import { responseFactory } from '@/utils/common.helpers';

import { GetAuctionsQueryDto } from './auctions.dto';
import { Auction, StatusEnum } from './auctions.types';
import { AuctionsRepository } from './auctions.repository';

export const AuctionsService = {
    getAuctions: (query: GetAuctionsQueryDto = {}) => {
        if (query.status)
            return AuctionsRepository.getAuctionsByStatus(query.status);

        return AuctionsRepository.getAll();
    },

    getAuction: (id: string) => AuctionsRepository.getById(id),

    createAuction: async (title: string, seller: string) => {
        const now = new Date();
        const createdAt = now.toISOString();
        const endingAt = addHours(now, 1).toISOString();
        const auction: Auction = {
            id: uuid(),
            title,
            seller,
            status: StatusEnum.OPEN,
            highestBid: { amount: 0 },
            endingAt,
            createdAt,
            updatedAt: createdAt,
        };

        await AuctionsRepository.create(auction);

        return responseFactory(auction, StatusCodes.CREATED);
    },

    updateAuction: async (id: string, updateAuctionDto: Partial<Auction>) => {
        const updatedAt = new Date().toISOString();

        return AuctionsRepository.update(id, {
            updatedAt,
            ...updateAuctionDto,
        });
    },

    deleteAuction: async (id: string) => {
        await AuctionsService.getAuction(id);
        await AuctionsRepository.delete(id);

        return responseFactory({}, StatusCodes.ACCEPTED);
    },

    closeAuction: async (auction: Auction) => {
        if (auction.status === StatusEnum.CLOSED)
            throw new createError.Forbidden('Auction is already closed!');

        await AuctionsService.updateAuction(auction.id, {
            status: StatusEnum.CLOSED,
        });

        const notifySeller = sqs
            .sendMessage(
                JSON.stringify({
                    subject: 'Your item has been bid on!',
                    recipient: auction.seller,
                    body: `Woohoo! Your item "${auction.title}" has been bid on!`,
                } as SendEmailDto),
            )
            .catch((e) => console.error(e));

        const notifyBidder = sqs
            .sendMessage(
                JSON.stringify({
                    subject: 'You won an auction!',
                    recipient: auction.highestBid.bidder,
                    body: `What a great deal! You got yourself a "${auction.title}"`,
                } as SendEmailDto),
            )
            .catch((e) => console.error(e));

        return Promise.all([notifySeller, notifyBidder]);
    },

    processAuctions: async () => {
        try {
            const auctionsToClose = await AuctionsRepository.getEndedAuctions();
            const closePromises = auctionsToClose.map(
                AuctionsService.closeAuction,
            );

            await Promise.all(closePromises);

            return { closed: closePromises.length };
        } catch (e) {
            throw new createError.InternalServerError((e as Error).message);
        }
    },

    placeBid: async (id: string, bidAmount: number, bidder: string) => {
        const auction = await AuctionsService.getAuction(id);

        if (auction.status === StatusEnum.CLOSED)
            throw new createError.Forbidden('Auction is already closed!');

        if (auction.seller === bidder)
            throw new createError.Forbidden(
                'You cannot bid on your own auctions!',
            );

        if (auction.highestBid.bidder === bidder)
            throw new createError.Forbidden(
                'You are already the highest bidder',
            );

        if (auction.highestBid.amount >= bidAmount)
            throw new createError.Forbidden(
                `Your bid must be higher than ${auction.highestBid.amount}!`,
            );

        return AuctionsService.updateAuction(id, {
            highestBid: {
                bidder,
                amount: bidAmount,
            },
        });
    },
};
