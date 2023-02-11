import { v4 as uuid } from 'uuid';
import createError from 'http-errors';
import addHours from 'date-fns/addHours';
import { StatusCodes } from 'http-status-codes';

import { GetAuctionsQueryDto } from './auctions.dto';
import { Auction, StatusEnum } from './auctions.types';
import { AuctionsRepository } from './auctions.repository';

import { responseFactory } from '@/utils/common.helpers';

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

    closeAuction: async (id: string) => {
        const auction = await AuctionsService.getAuction(id);

        if (auction.status === StatusEnum.CLOSED)
            throw new createError.Forbidden('Auction is already closed!');

        return AuctionsService.updateAuction(id, {
            status: StatusEnum.CLOSED,
        });
    },

    processAuctions: async () => {
        try {
            const auctionsToClose = await AuctionsRepository.getEndedAuctions();
            const closePromises = auctionsToClose.map((auction) =>
                AuctionsService.closeAuction(auction.id),
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
