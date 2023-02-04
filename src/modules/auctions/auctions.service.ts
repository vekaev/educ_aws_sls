import { v4 as uuid } from 'uuid';
import addHours from 'date-fns/addHours';
import createError from 'http-errors';
import { StatusCodes } from 'http-status-codes';

import { responseFactory } from '@/utils';

import { Auction, StatusEnum } from './auctions.types';
import { AuctionsRepository } from './auctions.repository';

export const AuctionsService = {
    getAuctions: AuctionsRepository.getAll,

    getAuction: (id: string) => AuctionsRepository.getById(id),

    createAuction: async (title: string) => {
        const now = new Date();
        const createdAt = now.toISOString();
        const endingAt = addHours(now, 1).toISOString();
        const auction: Auction = {
            id: uuid(),
            title,
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

        if (updateAuctionDto.highestBid?.amount) {
            const auction = await AuctionsService.getAuction(id);

            if (auction.highestBid.amount >= updateAuctionDto.highestBid.amount)
                throw new createError.Forbidden(
                    `Your bid must be higher than ${updateAuctionDto.highestBid.amount}!`
                );
        }

        return AuctionsRepository.update(id, {
            updatedAt,
            ...updateAuctionDto,
        });
    },

    deleteAuction: async (id: string) => {
        await AuctionsRepository.delete(id);

        return responseFactory({}, StatusCodes.ACCEPTED);
    },
};
